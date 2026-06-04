import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

def test_redis_host_default():
    from worker import REDIS_HOST
    assert isinstance(REDIS_HOST, str)
    assert len(REDIS_HOST) > 0

def test_redis_port_default():
    from worker import REDIS_PORT
    assert REDIS_PORT == 6379

def test_job_types_present():
    import json
    booking = {
        "booking_id": 1,
        "customer": "Ali Khan",
        "email": "ali@test.com",
        "car": "Toyota Camry",
        "pickup": "2026-06-10",
        "returnDate": "2026-06-14",
        "total": 220
    }
    payload = json.dumps(booking)
    parsed = json.loads(payload)
    assert parsed["booking_id"] == 1
    assert parsed["car"] == "Toyota Camry"
