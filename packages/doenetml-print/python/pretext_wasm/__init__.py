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


from .core.pretext.lib import pretext as ptx

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

# 135 bytes for a minimal compressed tarball (empty directory)
MIN_EMPTY_TGZ_FILE = (
    b"\x1f\x8b\x08\x00\x00\x00\x00\x00\x00\x03"
    b"c\x60\x60\x60\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
    b"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
    b"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
    b"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
    b"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
    b"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
    b"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
    b"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
    b"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
    b"\x00\x00\x00"
)


def runestone_services_stub(*args, **kwargs):
    """A stub for the runestone_services module, which is not compatible with the WASM build."""
    log.debug(
        "runestone_services_stub called with args: {}, kwargs: {}".format(args, kwargs)
    )
    format = "xml"
    try:
        format = kwargs.get("format")
    except Exception as e:
        log.error("Error accessing 'format' in kwargs: {}".format(e))
    if format == "tgz":
        # In this case, there should be a `out_path` kwarg. We want to save the minimal empty tgz file to that path.
        out_path = kwargs.get("out_path")
        try:
            with open(out_path, "wb") as f:
                f.write(MIN_EMPTY_TGZ_FILE)
            log.debug("Wrote minimal empty tgz file to {}".format(out_path))
        except Exception as e:
            log.error(
                "Error writing minimal empty tgz file to {}: {}".format(out_path, e)
            )
        return
    if format == "xml":
        return b"""<?xml version="1.0" encoding="UTF-8"?>
            <all>
                <js type="list">
                </js>
                <css type="list">
                </css>
                <cdn-url type="str">https://runestone.academy/cdn/runestone/</cdn-url>
                <version type="str">8.1.1</version>
            </all>
            """


def prefigure_conversion_stub(xml_file_name, format, working_dir):
    """Compile a PreFigure diagram. This uses a prefigure compile function from Javascript if available,
    otherwise is a no-op."""
    log.debug(
        "prefigure_conversion_stub called with xml_file_name: {}/{}, format: {}".format(
            working_dir,
            xml_file_name,
            format,
        )
    )
    # Read the XML file into a string from working_dir.
    xml_path = os.path.join(working_dir, xml_file_name)
    try:
        with open(xml_path, "r") as f:
            xml_string = f.read()
    except Exception as e:
        log.error("Error reading XML file from {}: {}".format(xml_path, e))
        return
    import prefig

    ret = prefig.engine.build_from_string("svg", xml_string)
    log.info("Prefigure diagram {}/{} converted successfully.".format(working_dir, xml_file_name))
    # PreTeXt assumes that prefigure diagrams end in `-diagcess.svg`
    # and that annotations end in `-annotations.xml`
    base_name = xml_file_name.rsplit(".", 1)[0]
    diagram_svg_name = base_name + "-diagcess.svg"
    annotations_name = base_name + "-annotations.xml"
    # Save the files to working_dir.

    (diagram_svg, annotations) = ret

    # Make the direcotry `./output` and `./output/prefigure` and save the files there.
    output_dir = os.path.join(working_dir, "output")
    prefigure_output_dir = os.path.join(output_dir, "prefigure")
    try:
        os.makedirs(prefigure_output_dir, exist_ok=True)
        diagram_svg_path = os.path.join(prefigure_output_dir, diagram_svg_name)
        annotations_path = os.path.join(prefigure_output_dir, annotations_name)
        with open(diagram_svg_path, "w") as f:
            f.write(diagram_svg)
        with open(annotations_path, "w") as f:
            f.write(annotations)
        log.info("Prefigure diagram and annotations saved to {}".format(prefigure_output_dir))
    except Exception as e:
        log.error("Error saving Prefigure diagram and annotations to {}: {}".format(prefigure_output_dir, e))
    return


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
        runestone_services_stub,
    )


def compile_prefigure(
    ptx_source=ptx_source_default,
    publication_source=publication_source_default,
):
    """Compile the PreFigure diagrams contained in the PreTeXt source."""
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

    ptx.prefigure_conversion(
        ptx_source,
        publication_source,
        {},
        "",
        os.path.join(ptx_source, "../out/generated"),
        "HTML",
        prefigure_conversion_stub,
        # None
        # lambda a, b, c: print("PreFigure conversion progress:", a, b, c),
    )
