import time
import json
import logging
import os
import redis

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [WORKER] %(message)s'
)
logger = logging.getLogger(__name__)

REDIS_HOST = os.environ.get("REDIS_HOST", "localhost")
REDIS_PORT = int(os.environ.get("REDIS_PORT", 6379))


def connect_redis():
    while True:
        try:
            r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
            r.ping()
            logger.info(f"Connected to Redis at {REDIS_HOST}:{REDIS_PORT}")
            return r
        except Exception as e:
            logger.warning(f"Redis not ready: {e}. Retrying in 3s...")
            time.sleep(3)


def send_confirmation(r, booking):
    logger.info(f"Sending confirmation to {booking['email']} for booking #{booking['booking_id']}")
    time.sleep(1.5)
    log = (
        f"[Booking #{booking['booking_id']}] Confirmation sent to {booking['email']} "
        f"| Car: {booking['car']} | {booking['pickup']} → {booking['returnDate']} "
        f"| Total: ${booking['total']}"
    )
    r.lpush("worker:logs", log)
    r.ltrim("worker:logs", 0, 49)
    r.set("worker:last_job", log)
    count = r.incr("worker:processed_count")
    logger.info(f"Done. Total processed: {count}")


def send_reminders(r):
    logger.info("Checking for upcoming bookings to remind...")
    time.sleep(1)
    log = "[Reminder] Checked upcoming bookings — all customers notified"
    r.lpush("worker:logs", log)
    r.ltrim("worker:logs", 0, 49)
    r.set("worker:last_job", log)
    logger.info("Reminders sent.")


def main():
    logger.info("Car Rental Worker starting...")
    r = connect_redis()
    logger.info("Worker ready. Listening for booking jobs...")
    reminder_counter = 0

    while True:
        # Process pending booking confirmations
        job = r.lpop("bookings:pending")
        if job:
            try:
                booking = json.loads(job)
                send_confirmation(r, booking)
            except Exception as e:
                logger.error(f"Failed to process job: {e}")
        else:
            # No pending bookings — send reminders every 5 cycles
            reminder_counter += 1
            if reminder_counter >= 5:
                send_reminders(r)
                reminder_counter = 0
            else:
                logger.info("No pending jobs. Waiting...")

        time.sleep(3)


if __name__ == "__main__":
    main()
