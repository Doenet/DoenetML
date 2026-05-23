# Since the WASM build cannot handle threading, we need to stub out the threading module.
import sys
import importlib.util
import os
from . import threading_stub

## Define the path to the threading_stub.py file
# threading_stub_path = os.path.join(os.path.dirname(__file__), 'threading_stub.py')
#
## Load the threading_stub module dynamically
# spec = importlib.util.spec_from_file_location("threading", threading_stub_path)
# threading_stub = importlib.util.module_from_spec(spec)
sys.modules["threading"] = threading_stub


from .core.pretext import pretext as ptx

pretext = ptx
import os

import logging

# ptxlogger will be compatible with the CLI logger.
log = logging.getLogger("ptxlogger")
log.setLevel(logging.DEBUG)
# Create stream handler for console output.
# Later we will set the level with log.setLevel(logging.[level])
console_log = logging.StreamHandler()
log_format = logging.Formatter("PTX:%(levelname)-8s: %(message)s")
console_log.setFormatter(log_format)
log.addHandler(console_log)


# Set some defaults. We compile the built-in hello example if nothing else is specified.
ptx_path = ptx.get_ptx_path()
ptx_source_default = os.path.join(ptx_path, "../templates/hello/source/main.ptx")
publication_source_default = os.path.join(
    ptx_path, "../templates/hello/publication/publication.ptx"
)


def compile(
    ptx_source=ptx_source_default,
    publication_source=publication_source_default,
):
    """Compile PreTeXt source. The paths given must be absolute. This assumes that a `./out` directory exists
    at the same level as your `ptx_source` file."""
    # Report Python version in debugging output
    log.debug(
        "Python version: {} (expecting 3.8 or newer)".format(ptx.python_version())
    )

    # Check discovering directory locations as
    # realized by PreTeXt installation
    # Necessary for locating configuration files (next)
    log.debug(
        "PreTeXt distribution and xsl directories: {}, {}".format(
            ptx.get_ptx_path(), ptx.get_ptx_xsl_path()
        )
    )

    log.debug("Publication source file: {}".format(publication_source))
    log.debug("Compiling PreTeXt source file: {}".format(ptx_source))

    ptx.html(
        ptx_source,
        publication_source,
        {},
        "",
        "html",
        None,
        None,
        os.path.join(ptx_source, "../out"),
    )
