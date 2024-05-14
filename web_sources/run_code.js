const { exec } = require('child_process');
const os = require('os');

function executeJavaScriptCode() {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;

    const editorId = activeTab.getAttribute("data-editor-id");

    const activeEditor = ace.edit(editorId);
    if (!activeEditor) return;

    const nodeCode = activeEditor.getValue();

    const downloadsPath = path.join(os.homedir(), 'Downloads');

    // Create a temporary file in downloads folder
    const tempFilePath = path.join(downloadsPath, 'tempCodeRunner.js');
    fs.writeFileSync(tempFilePath, nodeCode);
    if (os.platform() === 'darwin') {
        const homebrewPath = '/opt/homebrew/bin';
        if (fs.existsSync(homebrewPath)) {
            process.env.PATH = `${homebrewPath}:${process.env.PATH}`;
        } else {
           // Homebrew path doesn't exist on Mac OS, skipping
        }
    }

    // Execute Node.js code using child_process
    exec(`node ${tempFilePath}`, (error, stdout, stderr) => {
        fs.unlinkSync(tempFilePath);

        if (error) {
            console.error('Error executing Node.js code:', error.message);
            return;
        }
        if (stderr) {
            console.error('Node.js script encountered an error:', stderr);
            return;
        }
        console.log(stdout);
    });
}

function executePythonCode() {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;

    const editorId = activeTab.getAttribute("data-editor-id");

    const activeEditor = ace.edit(editorId);
    if (!activeEditor) return;

    const pythonCode = activeEditor.getValue();

    // Get the system's downloads folder path
    const downloadsPath = path.join(os.homedir(), 'Downloads');
    // Create a temporary file in downloads folder
    const tempFilePath = path.join(downloadsPath, 'tempCodeRunner.py');
    fs.writeFileSync(tempFilePath, pythonCode);

    exec(`python3 ${tempFilePath}`, (error, stdout, stderr) => {
        fs.unlinkSync(tempFilePath);

        if (error) {
            console.error('Error executing Python code:', error.message);
            return;
        }
        if (stderr) {
            console.error('Python script encountered an error:', stderr);
            return;
        }
        console.log(stdout);
    });
}

function htmlOutput() {
    var x = document.getElementById("output-container");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function executeHtmlCode() {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;

    const editorId = activeTab.getAttribute("data-editor-id");
    const activeEditor = ace.edit(editorId);
    if (!activeEditor) return;

    const htmlCode = activeEditor.getValue();

    const resultDiv = document.createElement("div");

    resultDiv.innerHTML = htmlCode;

    const scripts = resultDiv.querySelectorAll('script');
    scripts.forEach(script => {
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent;
        document.body.appendChild(newScript);
    });

    const outputContainer = document.getElementById("output-container");
    outputContainer.innerHTML = "";

    outputContainer.appendChild(resultDiv);
}

function runMarkdown() {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;

    const editorId = activeTab.getAttribute("data-editor-id");
    const activeEditor = ace.edit(editorId);
    const editorValue = activeEditor.getValue();

    const convertedHtml = convertToHtml(editorValue);

    const resultDiv = document.createElement("div");
    resultDiv.innerHTML = convertedHtml;

    const outputContainer = document.getElementById("output-container");
    outputContainer.innerHTML = "";
    outputContainer.appendChild(resultDiv);
}

function convertToHtml(markdown) {
    return markdown
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^#(.*?)(\n|$)/gm, '<h1>$1</h1>')
        .replace(/\n- (.*?)\n/g, '<ul><li>$1</li></ul>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function executeGoCode() {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;

    const editorId = activeTab.getAttribute("data-editor-id");

    const activeEditor = ace.edit(editorId);
    if (!activeEditor) return;

    const goCode = activeEditor.getValue();

    // Get the system's downloads folder path
    const downloadsPath = path.join(os.homedir(), 'Downloads');

    // Create a temporary file in downloads folder
    const tempFilePath = path.join(downloadsPath, 'tempCodeRunner.go');
    fs.writeFileSync(tempFilePath, goCode);

    exec(`go run ${tempFilePath}`, (error, stdout, stderr) => {
        fs.unlinkSync(tempFilePath);

        if (error) {
            console.error('Error executing Go code:', error.message);
            return;
        }
        if (stderr) {
            console.error('Go program encountered an error:', stderr);
            return;
        }
        console.log(stdout);
    });
}

function executeRubyCode() {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;

    const editorId = activeTab.getAttribute("data-editor-id");

    const activeEditor = ace.edit(editorId);
    if (!activeEditor) return;

    const rubyCode = activeEditor.getValue();

    // Get the system's downloads folder path
    const downloadsPath = path.join(os.homedir(), 'Downloads');

    // Create a temporary file in downloads folder
    const tempFilePath = path.join(downloadsPath, 'tempCodeRunner.rb');
    fs.writeFileSync(tempFilePath, rubyCode);

    exec(`ruby ${tempFilePath}`, (error, stdout, stderr) => {
        fs.unlinkSync(tempFilePath);

        if (error) {
            console.error('Error executing Ruby code:', error.message);
            return;
        }
        if (stderr) {
            console.error('Ruby program encountered an error:', stderr);
            return;
        }
        console.log(stdout);
    });
}

function executeRustCode() {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;

    const editorId = activeTab.getAttribute("data-editor-id");
    const activeEditor = ace.edit(editorId);
    if (!activeEditor) return;

    const rustCode = activeEditor.getValue();

    // Get the system's downloads folder path
    const downloadsPath = path.join(os.homedir(), 'Downloads');

    // Create a temporary directory in downloads folder
    const tempDirPath = path.join(downloadsPath, 'tempCodeRunnerRust');
    fs.mkdirSync(tempDirPath);

    const srcDirPath = path.join(tempDirPath, 'src');
    fs.mkdirSync(srcDirPath);

    const rustFilePath = path.join(srcDirPath, 'main.rs');
    fs.writeFileSync(rustFilePath, rustCode);

    const dependencies = parseDependencies(rustCode);

    // Write Cargo.toml with dependencies
    const cargoTomlContent = generateCargoToml(dependencies);
    const cargoTomlPath = path.join(tempDirPath, 'Cargo.toml');
    fs.writeFileSync(cargoTomlPath, cargoTomlContent);

    // Execute cargo build
    exec(`cd ${tempDirPath} && cargo build`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing Rust code:', error.message);
            deleteTempDir(tempDirPath);
            return;
        }

        const debugFolderPath = path.join(tempDirPath, 'target', 'debug');

        // Check if the executable exists
        const executablePath = path.join(debugFolderPath, 'temp_code_runner_rust');
        if (!fs.existsSync(executablePath)) {
            console.error('Error: Executable not found.');
            deleteTempDir(tempDirPath);
            return;
        }

        // Run the executable
        exec(`cd ${debugFolderPath} && ./temp_code_runner_rust`, (error, stdout, stderr) => {
            if (error) {
                console.error('Error running Rust executable:', error.message);
                deleteTempDir(tempDirPath);
                return;
            }
            if (stderr) {
                console.error('Rust executable encountered an error:', stderr);
                deleteTempDir(tempDirPath);
                return;
            }

            console.log(stdout);

            deleteTempDir(tempDirPath);
        });
    });
}

function parseDependencies(rustCode) {
    const dependencies = new Set();
    const lines = rustCode.split('\n');

    const ignoredDependencies = [
        /^alloc::AllocError$/,
        /^alloc::Global$/,
        /^alloc::Layout$/,
        /^alloc::LayoutError$/,
        /^boxed::Box$/,
        /^boxed::ThinBox$/,
        /^collections::TryReserveError$/,
        /^collections::binary_heap::BinaryHeap$/,
        /^collections::binary_heap::Drain$/,
        /^collections::binary_heap::DrainSorted$/,
        /^collections::binary_heap::IntoIter$/,
        /^collections::binary_heap::IntoIterSorted$/,
        /^collections::binary_heap::Iter$/,
        /^collections::binary_heap::PeekMut$/,
        /^collections::btree_map::BTreeMap$/,
        /^collections::btree_map::Cursor$/,
        /^collections::btree_map::CursorMut$/,
        /^collections::btree_map::CursorMutKey$/,
        /^collections::btree_map::ExtractIf$/,
        /^collections::btree_map::IntoIter$/,
        /^collections::btree_map::IntoKeys$/,
        /^collections::btree_map::IntoValues$/,
        /^collections::btree_map::Iter$/,
        /^collections::btree_map::IterMut$/,
        /^collections::btree_map::Keys$/,
        /^collections::btree_map::OccupiedEntry$/,
        /^collections::btree_map::OccupiedError$/,
        /^collections::btree_map::Range$/,
        /^collections::btree_map::RangeMut$/,
        /^collections::btree_map::UnorderedKeyError$/,
        /^collections::btree_map::VacantEntry$/,
        /^collections::btree_map::Values$/,
        /^collections::btree_map::ValuesMut$/,
        /^collections::btree_set::BTreeSet$/,
        /^collections::btree_set::Difference$/,
        /^collections::btree_set::ExtractIf$/,
        /^collections::btree_set::Intersection$/,
        /^collections::btree_set::IntoIter$/,
        /^collections::btree_set::Iter$/,
        /^collections::btree_set::Range$/,
        /^collections::btree_set::SymmetricDifference$/,
        /^collections::btree_set::Union$/,
        /^collections::linked_list::Cursor$/,
        /^collections::linked_list::CursorMut$/,
        /^collections::linked_list::ExtractIf$/,
        /^collections::linked_list::IntoIter$/,
        /^collections::linked_list::Iter$/,
        /^collections::linked_list::IterMut$/,
        /^collections::linked_list::LinkedList$/,
        /^collections::vec_deque::Drain$/,
        /^collections::vec_deque::IntoIter$/,
        /^collections::vec_deque::Iter$/,
        /^collections::vec_deque::IterMut$/,
        /^collections::vec_deque::VecDeque$/,
        /^ffi::CString$/,
        /^ffi::c_str::CString$/,
        /^ffi::c_str::FromVecWithNulError$/,
        /^ffi::c_str::IntoStringError$/,
        /^ffi::c_str::NulError$/,
        /^fmt::Arguments$/,
        /^fmt::DebugList$/,
        /^fmt::DebugMap$/,
        /^fmt::DebugSet$/,
        /^fmt::DebugStruct$/,
        /^fmt::DebugTuple$/,
        /^fmt::Error$/,
        /^fmt::Formatter$/,
        /^fmt::FormatterFn$/,
        /^rc::Rc$/,
        /^rc::UniqueRc$/,
        /^rc::Weak$/,
        /^slice::ArrayChunks$/,
        /^slice::ArrayChunksMut$/,
        /^slice::ArrayWindows$/,
        /^slice::ChunkBy$/,
        /^slice::ChunkByMut$/,
        /^slice::Chunks$/,
        /^slice::ChunksExact$/,
        /^slice::ChunksExactMut$/,
        /^slice::ChunksMut$/,
        /^slice::EscapeAscii$/,
        /^slice::Iter$/,
        /^slice::IterMut$/,
        /^slice::RChunks$/,
        /^slice::RChunksExact$/,
        /^slice::RChunksExactMut$/,
        /^slice::RChunksMut$/,
        /^slice::RSplit$/,
        /^slice::RSplitMut$/,
        /^slice::RSplitN$/,
        /^slice::RSplitNMut$/,
        /^slice::Split$/,
        /^slice::SplitInclusive$/,
        /^slice::SplitInclusiveMut$/,
        /^slice::SplitMut$/,
        /^slice::SplitN$/,
        /^slice::SplitNMut$/,
        /^slice::Windows$/,
        /^str::Bytes$/,
        /^str::CharIndices$/,
        /^str::Chars$/,
        /^str::EncodeUtf16$/,
        /^str::EscapeDebug$/,
        /^str::EscapeDefault$/,
        /^str::EscapeUnicode$/,
        /^str::Lines$/,
        /^str::LinesAny$/,
        /^str::MatchIndices$/,
        /^str::Matches$/,
        /^str::ParseBoolError$/,
        /^str::RMatchIndices$/,
        /^str::RMatches$/,
        /^str::RSplit$/,
        /^str::RSplitN$/,
        /^str::RSplitTerminator$/,
        /^str::Split$/,
        /^str::SplitAsciiWhitespace$/,
        /^str::SplitInclusive$/,
        /^str::SplitN$/,
        /^str::SplitTerminator$/,
        /^str::SplitWhitespace$/,
        /^str::Utf8Chunk$/,
        /^str::Utf8Chunks$/,
        /^str::Utf8Error$/,
        /^str::pattern::CharArrayRefSearcher$/,
        /^str::pattern::CharArraySearcher$/,
        /^str::pattern::CharPredicateSearcher$/,
        /^str::pattern::CharSearcher$/,
        /^str::pattern::CharSliceSearcher$/,
        /^str::pattern::StrSearcher$/,
        /^string::Drain$/,
        /^string::FromUtf16Error$/,
        /^string::FromUtf8Error$/,
        /^string::String$/,
        /^sync::Arc$/,
        /^sync::Weak$/,
        /^vec::Drain$/,
        /^vec::ExtractIf$/,
        /^vec::IntoIter$/,
        /^vec::Splice$/,
        /^vec::Vec$/,
        /^borrow::Cow$/,
        /^collections::TryReserveErrorKind$/,
        /^collections::btree_map::Entry$/,
        /^fmt::Alignment$/,
        /^str::pattern::SearchStep$/,
        /^alloc::Allocator$/,
        /^alloc::GlobalAlloc$/,
        /^borrow::Borrow$/,
        /^borrow::BorrowMut$/,
        /^borrow::ToOwned$/,
        /^fmt::Binary$/,
        /^fmt::Debug$/,
        /^fmt::Display$/,
        /^fmt::LowerExp$/,
        /^fmt::LowerHex$/,
        /^fmt::Octal$/,
        /^fmt::Pointer$/,
        /^fmt::UpperExp$/,
        /^fmt::UpperHex$/,
        /^fmt::Write$/,
        /^slice::Concat$/,
        /^slice::Join$/,
        /^slice::SliceIndex$/,
        /^str::FromStr$/,
        /^str::pattern::DoubleEndedSearcher$/,
        /^str::pattern::Pattern$/,
        /^str::pattern::ReverseSearcher$/,
        /^str::pattern::Searcher$/,
        /^string::ToString$/,
        /^task::LocalWake$/,
        /^task::Wake$/,
        /^format$/,
        /^vec$/,
        /^fmt::Debug$/,
        /^alloc::alloc$/,
        /^alloc::alloc_zeroed$/,
        /^alloc::dealloc$/,
        /^alloc::handle_alloc_error$/,
        /^alloc::realloc$/,
        /^fmt::format$/,
        /^fmt::write$/,
        /^slice::from_mut$/,
        /^slice::from_mut_ptr_range$/,
        /^slice::from_ptr_range$/,
        /^slice::from_raw_parts$/,
        /^slice::from_raw_parts_mut$/,
        /^slice::from_ref$/,
        /^slice::range$/,
        /^slice::try_range$/,
        /^str::from_boxed_utf8_unchecked$/,
        /^str::from_raw_parts$/,
        /^str::from_raw_parts_mut$/,
        /^str::from_utf8$/,
        /^str::from_utf8_mut$/,
        /^str::from_utf8_unchecked$/,
        /^str::from_utf8_unchecked_mut$/,
        /^alloc::LayoutErr$/,
        /^fmt::Result$/,
        /^string::ParseError$/
    ];

    lines.forEach(line => {
        // Check if the line contains an extern crate declaration
        const match = line.match(/^\s*extern\s+crate\s+(\w+)\s*;/);
        if (match) {
            const dependency = match[1];
            // Check if the dependency is not in the ignored list
            if (!ignoredDependencies.some(pattern => pattern.test(dependency))) {
                dependencies.add(dependency);
            }
        }
    });

    return Array.from(dependencies);
}



function generateCargoToml(dependencies) {
    let cargoTomlContent = '[package]\n';
    cargoTomlContent += 'name = "temp_code_runner_rust"\n';
    cargoTomlContent += 'version = "0.1.0"\n';
    cargoTomlContent += 'edition = "2018"\n\n';

    cargoTomlContent += '[dependencies]\n';
    dependencies.forEach(dep => {
        cargoTomlContent += `${dep} = "*"\n`;
    });

    return cargoTomlContent;
}

function deleteTempDir(tempDirPath) {
    fs.rmdirSync(tempDirPath, { recursive: true });
}

function executeKotlinCode() {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;

    const editorId = activeTab.getAttribute("data-editor-id");
    const activeEditor = ace.edit(editorId);
    if (!activeEditor) return;

    const kotlinCode = activeEditor.getValue();

    // Get the system's downloads folder path
    const downloadsPath = path.join(os.homedir(), 'Downloads');

    // Create a temporary file in downloads folder
    const tempFilePath = path.join(downloadsPath, 'tempCodeRunner.kt');
    fs.writeFileSync(tempFilePath, kotlinCode);

    exec(`kotlin ${tempFilePath}`, (error, stdout, stderr) => {
        fs.unlinkSync(tempFilePath);

        if (error) {
            console.error('Error executing Kotlin code:', error.message);
            return;
        }
        if (stderr) {
            console.error('Kotlin program encountered an error:', stderr);
            return;
        }
        console.log(stdout);
    });
}

function executeCppCode() {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;

    const editorId = activeTab.getAttribute("data-editor-id");
    const activeEditor = ace.edit(editorId);
    if (!activeEditor) return;

    const cppCode = activeEditor.getValue();

    // Get the system's downloads folder path
    const downloadsPath = path.join(os.homedir(), 'Downloads');

    // Create a temporary directory in downloads folder
    const tempDirPath = path.join(downloadsPath, 'tempCodeRunnerCpp');
    fs.mkdirSync(tempDirPath);

    // Create a source file in the directory
    const tempFilePath = path.join(tempDirPath, 'main.cpp');
    fs.writeFileSync(tempFilePath, cppCode);

    // Generate CMakeLists.txt
    const cmakeContent = generateCMakeListsForCpp(tempDirPath, cppCode);
    const cmakeFilePath = path.join(tempDirPath, 'CMakeLists.txt');
    fs.writeFileSync(cmakeFilePath, cmakeContent);

    // Compile and execute using CMake
    exec(`cd ${tempDirPath} && cmake . && make && ./main`, (error, stdout, stderr) => {
        deleteTempDir(tempDirPath);

        if (error) {
            console.error('Error executing C++ code:', error.message);
        }
        if (stderr) {
            console.error('C++ program encountered an error:', stderr);
            return;
        }
        console.log(stdout);
    });
}

function generateCMakeListsForCpp(tempDirPath, cppCode) {
    let cmakeContent = `cmake_minimum_required(VERSION 3.10)\n`;
    cmakeContent += `project(tempCodeRunnerCpp)\n\n`;

    cmakeContent += `add_executable(main main.cpp)\n`;

    // List of standard libraries to skip
    const stdCLibraries = [
        "cstddef",
        "cstdlib",
        "version",
        "limits",
        "climits",
        "cfloat",
        "cstdint",
        "stdfloat",
        "new",
        "typeinfo",
        "source_location",
        "exception",
        "initializer_list",
        "compare",
        "coroutine",
        "csignal",
        "csetjmp",
        "cstdarg",
        "concepts",
        "stdexcept",
        "stacktrace",
        "cassert",
        "cerrno",
        "system_error",
        "memory",
        "memory_resource",
        "scoped_allocator",
        "type_traits",
        "ratio",
        "utility",
        "tuple",
        "optional",
        "variant",
        "any",
        "debugging",
        "expected",
        "bitset",
        "functional",
        "typeindex",
        "execution",
        "charconv",
        "format",
        "bit",
        "string_view",
        "string",
        "cctype",
        "cwctype",
        "cstring",
        "cwchar",
        "cuchar",
        "array",
        "deque",
        "forward_list",
        "list",
        "vector",
        "map",
        "set",
        "unordered_map",
        "unordered_set",
        "queue",
        "stack",
        "flat_map",
        "flat_set",
        "span",
        "mdspan",
        "iterator",
        "ranges",
        "generator",
        "algorithm",
        "numeric",
        "cfenv",
        "complex",
        "random",
        "valarray",
        "cmath",
        "linalg",
        "numbers",
        "chrono",
        "ctime",
        "locale",
        "clocale",
        "codecvt",
        "text_encoding",
        "iosfwd",
        "iostream",
        "ios",
        "streambuf",
        "istream",
        "ostream",
        "iomanip",
        "print",
        "sstream",
        "spanstream",
        "fstream",
        "syncstream",
        "filesystem",
        "cstdio",
        "cinttypes",
        "strstream",
        "regex",
        "stop_token",
        "thread",
        "atomic",
        "rcu",
        "stdatomic.h",
        "mutex",
        "shared_mutex",
        "condition_variable",
        "semaphore",
        "latch",
        "barrier",
        "future",
        "hazard_pointer",
        "cstdbool",
        "ccomplex",
        "ctgmath",
        "cstdalign",
        "ciso646"
    ];

    // Extract included libraries
    const includedLibraries = parseIncludedLibraries(cppCode);
    includedLibraries.forEach(lib => {
        if (!stdCLibraries.includes(lib)) { // Check if it's not a library to skip
            cmakeContent += `find_package(${lib})\n`;
            cmakeContent += `target_link_libraries(main ${lib}::${lib})\n`;
        }
    });

    return cmakeContent;
}


function parseIncludedLibraries(cppCode) {
    const libraries = new Set();
    const lines = cppCode.split('\n');

    lines.forEach(line => {
        // Check if the line contains an include directive
        const match = line.match(/^\s*#include\s+<(.+)>/);
        if (match) {
            const library = match[1].split('/')[0]; // Extract the library name
            libraries.add(library);
        }
    });

    return Array.from(libraries);
}

function executeCCode() {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;

    const editorId = activeTab.getAttribute("data-editor-id");
    const activeEditor = ace.edit(editorId);
    if (!activeEditor) return;

    const cCode = activeEditor.getValue();

    // Get the system's downloads folder path
    const downloadsPath = path.join(os.homedir(), 'Downloads');

    // Create a temporary directory in downloads folder
    const tempDirPath = path.join(downloadsPath, 'tempCodeRunnerC');
    fs.mkdirSync(tempDirPath);

    // Create a source file in the directory
    const tempFilePath = path.join(tempDirPath, 'main.c');
    fs.writeFileSync(tempFilePath, cCode);

    // Generate CMakeLists.txt
    const cmakeContent = generateCMakeListsForC(tempDirPath, cCode);
    const cmakeFilePath = path.join(tempDirPath, 'CMakeLists.txt');
    fs.writeFileSync(cmakeFilePath, cmakeContent);

    // Compile and execute using CMake
    exec(`cd ${tempDirPath} && cmake . && make && ./main`, (error, stdout, stderr) => {
        deleteTempDir(tempDirPath);

        if (error) {
            console.error('Error executing C code:', error.message);
        }
        if (stderr) {
            console.error('C program encountered an error:', stderr);
            return;
        }
        console.log(stdout);
    });
}

function generateCMakeListsForC(tempDirPath, cCode) {
    let cmakeContent = `cmake_minimum_required(VERSION 3.10)\n`;
    cmakeContent += `project(tempCodeRunnerC)\n\n`;

    cmakeContent += `add_executable(main main.c)\n`;

    // List of C default libraries
    const cLibraries = [
        "assert.h",
        "complex.h",
        "ctype.h",
        "errno.h",
        "fenv.h",
        "float.h",
        "inttypes.h",
        "iso646.h",
        "limits.h",
        "locale.h",
        "math.h",
        "setjmp.h",
        "signal.h",
        "stdalign.h",
        "stdarg.h",
        "stdatomic.h",
        "stdbit.h",
        "stdbool.h",
        "stdckdint.h",
        "stddef.h",
        "stdint.h",
        "stdio.h",
        "stdlib.h",
        "stdnoreturn.h",
        "string.h",
        "tgmath.h",
        "threads.h",
        "time.h",
        "uchar.h",
        "wchar.h",
        "wctype.h"
    ];

    cLibraries.forEach(lib => {
        cmakeContent += `find_package(${lib})\n`;
        cmakeContent += `target_link_libraries(main ${lib}::${lib})\n`;
    });

    return cmakeContent;
}
