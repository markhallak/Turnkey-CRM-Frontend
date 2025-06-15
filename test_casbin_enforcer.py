import casbin
import pytest

@pytest.fixture(scope="module")
def enforcer():
    model_path = "model.conf"
    policy_path = "policy.csv"
    e = casbin.Enforcer(model_path, policy_path)
    e.enable_auto_save(True)
    return e

@pytest.mark.parametrize(
    "sub, dom, obj, act, expected",
    [
        ("alice", "global", "/admin/dashboard", "get", True),
        ("alice", "global", "/users", "post", True),
        ("bob", "client1", "/projects", "get", True),
        ("bob", "client2", "/projects", "get", False),
        ("carol", "client1", "/comments", "post", True),
        ("dave", "client1", "/projects", "read_basic", True),
        ("dave", "client1", "/projects", "read_financial", False),
        ("dave", "client1", "/projects", "post", False),
    ],
)
def test_policy(enforcer, sub, dom, obj, act, expected):
    result = enforcer.enforce(sub, dom, obj, act)
    assert result is expected, f"{sub}@{dom} on {obj}#{act} expected={expected}, got={result}"
