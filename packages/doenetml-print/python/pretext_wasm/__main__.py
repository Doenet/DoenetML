from .core.pretext import pretext as ptx
from . import compile
import os


ptx_path = ptx.get_ptx_path()

compile(
    os.path.join(ptx_path, "../templates/hello/source/main.ptx"),
    os.path.join(ptx_path, "../templates/hello/publication/publication.ptx"),
)
