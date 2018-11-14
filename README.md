# node-profiler-report

This package will generate an HTML report from the data processed by Node's profiler.

## Getting Started

### Install the package

    npm install -g profiler-report

### Generate some profiling data

To start the profiling process, launch `node` with the `--prof` argument before the script:

    node --prof path/to/app.js

This will generate a log file. Next, process the log file to generate the summary data:

    node --prof-process isolate-0xnnnnnnnnn-v8.log > processed.txt

Finally, generate the report:

    profiler-report processed.txt

This will take a few seconds. When it's done, there will be a new directory called `report`. Inside that directory is an `index.html` file. Open this file in your browser to see the report.
