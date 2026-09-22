from typing import Any

class jwt:
    @staticmethod
    def encode(claims: dict, key: str, algorithm: str = ...) -> str: ...
    @staticmethod
    def decode(token: str, key: str, algorithms: list = ...) -> dict: ...
