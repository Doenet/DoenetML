## Setup

This tool now lives inside the DoenetML monorepo at `packages/webwork-to-doenetml`.

Make sure you have Node installed: `node -v`

## Usage

Paste the WeBWorK Perl code into `packages/webwork-to-doenetml/input.pg`.

From the repository root, run:

`npm run convert -w packages/webwork-to-doenetml`

That writes the converted output to `packages/webwork-to-doenetml/output.doenetml`.

If you don't want to include the original WeBWorK problem in the generated output, run:

`npm run convert -w packages/webwork-to-doenetml -- hide-original`

You can also run the package locally from inside `packages/webwork-to-doenetml` with:

`npm run convert`
