# A mock for the Threading library. This runs threads synchronously so that they will work in Pyodide in
# the browser.

from threading import *


class Thread:
    def __init__(
        self, group=None, target=None, name=None, args=(), kwargs={}, *, daemon=None
    ):
        self.target = target

    def start(self):
        self.target()

    def join(self, timeout=None):
        pass

    def is_alive(self):
        return False


def _shutdown(*args, **kwargs):
    pass
