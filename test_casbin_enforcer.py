# tests/test_casbin_enforcer.py

import casbin
import pytest

def auto_enforce(enforcer, sub: str, obj: str, act: str) -> bool:
    grouping = enforcer.get_model().model["g"]["g"].policy
    domains = {rule[2] for rule in grouping if rule[0] == sub}
    for dom in domains:
        if enforcer.enforce(sub, dom, obj, act):
            return True
    return False

@pytest.fixture(scope="module")
def enforcer():
    e = casbin.Enforcer("model.conf", "policy.csv")
    e.enable_auto_save(True)
    return e

@pytest.mark.parametrize(
    "sub, obj, act, expected",
    [
        #— Original: Admin (alice) wildcard everything ——
        ("alice", "/admin/dashboard",       "get",                     True),
        ("alice", "/any/route",             "delete",                  True),

        #— Additional alice cases ——
        ("alice", "/clients",               "patch",                   True),
        ("alice", "/random/path/123",       "foobar",                  True),
        ("alice", "/projects/999",          "write",                   True),
        ("alice", "/send-message",          "anything",                True),

        #— Bob (emp_acct_manager) ——
        ("bob",   "/clients",               "read",                    True),
        ("bob",   "/clients",               "write",                   False),
        ("bob",   "/projects",              "read",                    True),
        ("bob",   "/projects",              "write",                   True),
        ("bob",   "/projects",              "post",                    False),
        ("bob",   "/projects",              "read_without_financial",  False),
        ("bob",   "/projects/123",          "read",                    False),
        ("bob",   "/send-message",          "read",                    False),
        ("bob",   "/send-message",          "write",                   False),

        #— John (emp_acct_manager on client2) ——
        ("john",  "/clients",               "read",                    True),
        ("john",  "/projects",              "write",                   True),
        ("john",  "/projects",              "read",                    True),
        ("john",  "/projects",              "delete",                  False),
        ("john",  "/clients",               "delete",                  False),
        ("john",  "/send-message",          "read",                    False),

        #— Carol (client_admin) ——
        ("carol", "/projects",              "read",                    True),
        ("carol", "/projects",              "write",                   True),
        ("carol", "/projects/42",           "read",                    False),
        ("carol", "/projects/42",           "write",                   False),
        ("carol", "/send-message",          "read",                    True),
        ("carol", "/send-message",          "write",                   True),
        ("carol", "/send-message/1",        "read",                    False),
        ("carol", "/clients",               "read",                    False),
        ("carol", "/admin/dashboard",       "get",                     False),
        ("carol", "/any/route",             "delete",                  False),

        #— Dave (client_tech) ——
        ("dave",  "/projects",              "read_without_financial",  True),
        ("dave",  "/projects",              "read",                    False),
        ("dave",  "/projects",              "write",                   False),
        ("dave",  "/projects/1",            "read_without_financial",  False),
        ("dave",  "/send-message",          "read_without_financial",  False),
        ("dave",  "/send-message",          "read",                    False),
        ("dave",  "/send-message",          "write",                   False),
        ("dave",  "/projects",              "DELETE",                  False),  # case-sensitive

        #— Unknown / edge users ——
        ("eve",   "/projects",              "read",                    False),
        ("unknown","/anything",             "get",                     False),
        ("",      "/projects",              "read",                    False),
        ("alice", "",                        "get",                     True),   # obj="" matches wildcard
        ("alice", "/clients",               "",                        True),   # act="" matches wildcard
    ],
)
def test_policy(enforcer, sub, obj, act, expected):
    result = auto_enforce(enforcer, sub, obj, act)
    assert result is expected, f"{sub!r} on {obj!r}#{act!r} expected={expected}, got={result}"
