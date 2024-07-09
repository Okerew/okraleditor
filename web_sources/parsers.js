function parseJavaScript(editorValue) {
    let parsed;
    try {
        parsed = esprima.parseModule(editorValue, {
            jsx: true,
            tolerant: true,
            loc: true,
        });
    } catch (parseError) {
        console.error("Error parsing the editor content:", parseError);
        return [];
    }

    const outline = [];

    function traverse(node, parent) {
        try {
            switch (node.type) {
                case "FunctionDeclaration":
                    outline.push({
                        type: "Function",
                        name: node.id.name,
                        loc: node.loc,
                    });
                    break;
                case "ClassDeclaration":
                    outline.push({ type: "Class", name: node.id.name, loc: node.loc });
                    break;
                case "VariableDeclaration":
                    node.declarations.forEach((decl) => {
                        outline.push({
                            type: "Variable",
                            name: decl.id.name,
                            loc: node.loc,
                        });
                    });
                    break;
                default:
                    break;
            }

            for (let key in node) {
                if (node[key] && typeof node[key] === "object") {
                    traverse(node[key], node);
                }
            }
        } catch (traverseError) {
            console.error("Error traversing the AST:", traverseError);
        }
    }

    traverse(parsed, null);
    return outline;
}

function addError(outline, errorType, message, line, column) {
    const explanation = getErrorExplanation(errorType, message);
    outline.push({
        type: 'Error',
        errorType: errorType,
        message: message,
        explanation: explanation,
        loc: { start: { line: line, column: column } }
    });
}

function getErrorExplanation(errorType, message) {
    const explanations = {
        'SyntaxError': 'This is a syntax error. It means the code violates the grammar rules of the language.',
        'StyleWarning': 'This is a style warning. While the code may work, it doesn\'t follow best practices.',
        'MemoryError': 'This error relates to memory management, which can lead to memory leaks or crashes.',
        'IncludeError': 'This error is related to how files are included or imported in the code.',
        'NamingConvention': 'This warning indicates that the naming doesn\'t follow the language\'s conventional style.',
        'UnwrapWarning': 'This warning is about unsafe handling of potentially null values.',
        'VisibilityWarning': 'This warning relates to the visibility or accessibility of code elements.',
        'CompatibilityError': 'This error indicates code that may not be compatible with the intended version of the language.',
        'ExceptionHandling': 'This warning is about potentially unsafe or overly broad exception handling.',
        'NullSafety': 'This warning is about unsafe handling of nullable types, which could lead to null pointer exceptions.',
        'UnusedWarning': 'This warning indicates that a declared variable or import is not used in the code.',
        'TypeError': 'This error is related to incorrect use of types in the code.',
        'DeprecationWarning': 'This warning indicates the use of deprecated features that may be removed in future versions.'
    };

    return `${explanations[errorType] || 'This is a potential issue in your code.'} Specific issue: ${message}`;
}

function parseGo(editorValue) {
    const code = editorValue;
    const outline = [];
    const lines = code.split('\n');
    let bracketCount = 0;
    let indentationLevel = 0;
    let imports = new Set();
    let declaredVars = new Set();
    let usedVars = new Set();

    lines.forEach((line, index) => {
        const stripped = line.trim();

        // Count brackets to track nesting
        bracketCount += (stripped.match(/{/g) || []).length;
        bracketCount -= (stripped.match(/}/g) || []).length;

        if (bracketCount > indentationLevel) {
            indentationLevel = bracketCount;
        } else if (bracketCount < indentationLevel) {
            indentationLevel = bracketCount;
        }

        // Check for mismatched brackets
        if (bracketCount < 0) {
            addError(outline, 'SyntaxError', 'Mismatched closing bracket', index + 1, line.indexOf('}') + 1);
        }

        // Match function declarations
        const funcMatch = stripped.match(/^func\s+(\w+)/);
        if (funcMatch) {
            outline.push({
                type: 'Function',
                name: funcMatch[1],
                loc: { start: { line: index + 1, column: line.indexOf('func') + 1 } },
                indentation: indentationLevel
            });
        }

        // Match method declarations
        const methodMatch = stripped.match(/^func\s+\(\w+\s+\*?\w+\)\s+(\w+)/);
        if (methodMatch) {
            outline.push({
                type: 'Method',
                name: methodMatch[1],
                loc: { start: { line: index + 1, column: line.indexOf('func') + 1 } },
                indentation: indentationLevel
            });
        }

        // Match struct declarations
        const structMatch = stripped.match(/^type\s+(\w+)\s+struct/);
        if (structMatch) {
            outline.push({
                type: 'Struct',
                name: structMatch[1],
                loc: { start: { line: index + 1, column: line.indexOf('type') + 1 } },
                indentation: indentationLevel
            });
        }

        // Match interface declarations
        const interfaceMatch = stripped.match(/^type\s+(\w+)\s+interface/);
        if (interfaceMatch) {
            outline.push({
                type: 'Interface',
                name: interfaceMatch[1],
                loc: { start: { line: index + 1, column: line.indexOf('type') + 1 } },
                indentation: indentationLevel
            });
        }

        // In parseGo function
        if (bracketCount < 0) {
            addError(outline, 'SyntaxError', 'Mismatched closing bracket. You have more closing brackets than opening brackets.', index + 1, line.indexOf('}') + 1);
        }
        if (stripped.match(/^\s*import\s+[^(]/)) {
            addError(outline, 'SyntaxError', 'Import statement should use parentheses. Use "import ( ... )" for multiple imports.', index + 1, line.indexOf('import') + 1);
        }
        if (stripped.match(/:\=/)) {
            addError(outline, 'SyntaxError', 'Incorrect spacing around :=. Use ":=" without spaces for short variable declarations.', index + 1, line.indexOf(':=') + 1);
        }

        if (stripped.startsWith('import ')) {
            const importMatch = stripped.match(/import\s+(\w+)/);
            if (importMatch) {
                imports.add(importMatch[1]);
            }
        }

        // Check for unused variables
        const varDecl = stripped.match(/^var\s+(\w+)/);
        if (varDecl) {
            declaredVars.add(varDecl[1]);
        }

        // Check for variable usage
        const varUsage = stripped.match(/\b(\w+)\b/g);
        if (varUsage) {
            varUsage.forEach(v => usedVars.add(v));
        }

        // Check for incorrect error handling
        if (stripped.includes('err != nil') && !stripped.includes('return')) {
            addError(outline, 'ErrorHandling', 'Error is checked but not returned. Consider returning the error.', index + 1, line.indexOf('err') + 1);
        }

        // Check for use of deprecated iota in const block
        if (stripped.match(/const\s*\(\s*\w+\s*=\s*iota/)) {
            addError(outline, 'DeprecationWarning', 'Using iota in const block is deprecated. Use iota within the const block instead.', index + 1, line.indexOf('iota') + 1);
        }
    });

    // Check for unused imports and variables
    imports.forEach(imp => {
        if (!usedVars.has(imp)) {
            addError(outline, 'UnusedWarning', `Unused import: ${imp}`, 1, 1);
        }
    });

    declaredVars.forEach(v => {
        if (!usedVars.has(v)) {
            addError(outline, 'UnusedWarning', `Unused variable: ${v}`, 1, 1);
        }
    });

    return outline;
}


function parseCPP(editorValue) {
    const code = editorValue;
    const outline = [];
    const lines = code.split('\n');
    let declaredVars = new Set();
    let usedVars = new Set();


    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('class ')) {
            const match = trimmedLine.match(/class\s+(\w+)/);
            if (match) {
                outline.push({ type: 'Class', name: match[1], loc: { start: { line: index + 1, column: line.indexOf('class') + 1 } } });
            }
        } else if (trimmedLine.startsWith('struct ')) {
            const match = trimmedLine.match(/struct\s+(\w+)/);
            if (match) {
                outline.push({ type: 'Struct', name: match[1], loc: { start: { line: index + 1, column: line.indexOf('struct') + 1 } } });
            }
        } else if (trimmedLine.match(/\w+\s+\w+\s*\([^)]*\)\s*(?:const)?\s*(?:noexcept)?\s*(?:=\s*0)?\s*(?:override)?\s*(?:final)?\s*(?:{\s*)?$/)) {
            const match = trimmedLine.match(/(\w+)\s*\(/);
            if (match) {
                outline.push({ type: 'Function', name: match[1], loc: { start: { line: index + 1, column: line.indexOf(match[1]) + 1 } } });
            }
        }

        // Check for common C++ errors
        if (trimmedLine.includes('using namespace std;')) {
            addError(outline, 'StyleWarning', 'Avoid using "using namespace std;" in global scope. It can lead to name conflicts.', index + 1, line.indexOf('using') + 1);
        }
        if (trimmedLine.match(/delete\s+\[]/)) {
            addError(outline, 'MemoryError', 'Use delete[] for array deallocation. "delete" without brackets is for single objects.', index + 1, line.indexOf('delete') + 1);
        }
        if (trimmedLine.match(/^\s*#include\s+[<"].*\.cpp[">]/)) {
            addError(outline, 'IncludeError', 'Avoid including .cpp files. Include header (.h) files instead.', index + 1, line.indexOf('#include') + 1);
        }
        if (trimmedLine.includes('new ') && !trimmedLine.includes('delete')) {
            addError(outline, 'MemoryError', 'Potential memory leak. Remember to delete dynamically allocated memory.', index + 1, line.indexOf('new') + 1);
        }

        // Check for use of deprecated features
        if (trimmedLine.includes('auto_ptr')) {
            addError(outline, 'DeprecationWarning', 'auto_ptr is deprecated. Use unique_ptr instead.', index + 1, line.indexOf('auto_ptr') + 1);
        }

        // Check for variable declarations and usage
        const varDecl = trimmedLine.match(/\b(?:int|float|double|char|bool)\s+(\w+)/);
        if (varDecl) {
            declaredVars.add(varDecl[1]);
        }

        const varUsage = trimmedLine.match(/\b(\w+)\b/g);
        if (varUsage) {
            varUsage.forEach(v => usedVars.add(v));
        }
    });

    // Check for unused variables
    declaredVars.forEach(v => {
        if (!usedVars.has(v)) {
            addError(outline, 'UnusedWarning', `Unused variable: ${v}`, 1, 1);
        }
    });

    return outline;
}

function parseRust(editorValue) {
    const code = editorValue;
    const outline = [];
    const lines = code.split('\n');
    let declaredVars = new Set();
    let usedVars = new Set();

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('fn ')) {
            const match = trimmedLine.match(/fn\s+(\w+)/);
            if (match) {
                outline.push({ type: 'Function', name: match[1], loc: { start: { line: index + 1, column: line.indexOf('fn') + 1 } } });
            }
        } else if (trimmedLine.startsWith('struct ')) {
            const match = trimmedLine.match(/struct\s+(\w+)/);
            if (match) {
                outline.push({ type: 'Struct', name: match[1], loc: { start: { line: index + 1, column: line.indexOf('struct') + 1 } } });
            }
        } else if (trimmedLine.startsWith('enum ')) {
            const match = trimmedLine.match(/enum\s+(\w+)/);
            if (match) {
                outline.push({ type: 'Enum', name: match[1], loc: { start: { line: index + 1, column: line.indexOf('enum') + 1 } } });
            }
        } else if (trimmedLine.startsWith('trait ')) {
            const match = trimmedLine.match(/trait\s+(\w+)/);
            if (match) {
                outline.push({ type: 'Trait', name: match[1], loc: { start: { line: index + 1, column: line.indexOf('trait') + 1 } } });
            }
        } else if (trimmedLine.startsWith('impl ')) {
            const match = trimmedLine.match(/impl(?:\s+\w+\s+for)?\s+(\w+)/);
            if (match) {
                outline.push({ type: 'Implementation', name: match[1], loc: { start: { line: index + 1, column: line.indexOf('impl') + 1 } } });
            }
        }

        if (trimmedLine.match(/^\s*let\s+mut\s+[A-Z]/)) {
            addError(outline, 'NamingConvention', 'Mutable variables should use snake_case. Capital letters are typically used for constants.', index + 1, line.indexOf('let') + 1);
        }
        if (trimmedLine.includes('unwrap()')) {
            addError(outline, 'UnwrapWarning', 'Avoid using unwrap() in production code. It can cause panics if the Result is an Err or the Option is None.', index + 1, line.indexOf('unwrap') + 1);
        }
        if (trimmedLine.match(/^\s*pub\s+struct\s+.*\{/)) {
            addError(outline, 'VisibilityWarning', 'Consider using pub(crate) for internal structs. This limits the struct\'s visibility to within the current crate.', index + 1, line.indexOf('pub') + 1);
        }
        if (trimmedLine.match(/\+|\-|\*|\//) && !trimmedLine.includes('checked_')) {
            addError(outline, 'ArithmeticWarning', 'Potential integer overflow. Consider using checked arithmetic operations.', index + 1, line.indexOf('+') + 1);
        }

        // Check for unsafe code blocks
        if (trimmedLine.startsWith('unsafe')) {
            addError(outline, 'UnsafeWarning', 'Unsafe code block detected. Ensure that safety invariants are maintained.', index + 1, line.indexOf('unsafe') + 1);
        }

        // Check for variable declarations and usage
        const varDecl = trimmedLine.match(/let\s+(\w+)/);
        if (varDecl) {
            declaredVars.add(varDecl[1]);
        }

        const varUsage = trimmedLine.match(/\b(\w+)\b/g);
        if (varUsage) {
            varUsage.forEach(v => usedVars.add(v));
        }
    });

    // Check for unused variables
    declaredVars.forEach(v => {
        if (!usedVars.has(v)) {
            addError(outline, 'UnusedWarning', `Unused variable: ${v}`, 1, 1);
        }
    });

    return outline;
}

function parsePython(editorValue) {
    const code = editorValue;
    const outline = [];
    const lines = code.split('\n');
    let indentationLevel = 0;
    const indentStack = [0];
    let imports = new Set();
    let declaredVars = new Set();
    let usedVars = new Set();

    lines.forEach((line, index) => {
        const stripped = line.trim();
        const indentation = line.match(/^\s*/)[0].length;

        if (indentation < indentStack[indentStack.length - 1]) {
            while (indentation < indentStack[indentStack.length - 1]) {
                indentStack.pop();
                indentationLevel--;
            }
        } else if (indentation > indentStack[indentStack.length - 1]) {
            indentStack.push(indentation);
            indentationLevel++;
        }

        if (stripped.startsWith('def ')) {
            const match = stripped.match(/def\s+(\w+)/);
            if (match) {
                outline.push({
                    type: 'Function',
                    name: match[1],
                    loc: { start: { line: index + 1, column: line.indexOf('def') + 1 } },
                    indentation: indentationLevel
                });
            }
        } else if (stripped.startsWith('class ')) {
            const match = stripped.match(/class\s+(\w+)/);
            if (match) {
                outline.push({
                    type: 'Class',
                    name: match[1],
                    loc: { start: { line: index + 1, column: line.indexOf('class') + 1 } },
                    indentation: indentationLevel
                });
            }
        }

        // In parseKotlin function
        if (stripped.match(/^\s*var\s+[A-Z]/)) {
            addError(outline, 'NamingConvention', 'Variable names should start with lowercase. Capital letters are typically used for classes and interfaces.', index + 1, line.indexOf('var') + 1);
        }
        if (stripped.includes('!!')) {
            addError(outline, 'NullSafety', 'Avoid using !! operator. It can throw NullPointerException if the value is null. Consider using safe calls (?.) or Elvis operator (?:) instead.', index + 1, line.indexOf('!!') + 1);
        }
        if (stripped.match(/^\s*if\s*\([^)]*\)\s*[^{]/)) {
            addError(outline, 'StyleWarning', 'Consider using curly braces for if statements. This improves readability and reduces the risk of errors when adding more lines.', index + 1, line.indexOf('if') + 1);
        }
        // Check for potential type errors
        if (stripped.includes('+ ""') || stripped.includes('+ \'\'')) {
            addError(outline, 'TypeError', 'Potential type error. Concatenating number and string may cause issues.', index + 1, line.indexOf('+') + 1);
        }

        // Check for use of global statement
        if (stripped.startsWith('global ')) {
            addError(outline, 'StyleWarning', 'Use of global statement. Consider using function parameters instead.', index + 1, line.indexOf('global') + 1);
        }

        // Check for imports and variable usage
        const importMatch = stripped.match(/^import\s+(\w+)/);
        if (importMatch) {
            imports.add(importMatch[1]);
        }

        const varAssign = stripped.match(/^(\w+)\s*=/);
        if (varAssign) {
            declaredVars.add(varAssign[1]);
        }

        const varUsage = stripped.match(/\b(\w+)\b/g);
        if (varUsage) {
            varUsage.forEach(v => usedVars.add(v));
        }
    });

    // Check for unused imports and variables
    imports.forEach(imp => {
        if (!usedVars.has(imp)) {
            addError(outline, 'UnusedWarning', `Unused import: ${imp}`, 1, 1);
        }
    });

    declaredVars.forEach(v => {
        if (!usedVars.has(v)) {
            addError(outline, 'UnusedWarning', `Unused variable: ${v}`, 1, 1);
        }
    });

    return outline;
}

function parseKotlin(editorValue) {
    const code = editorValue;
    const outline = [];
    const lines = code.split('\n');
    let bracketCount = 0;
    let indentationLevel = 0;
    let declaredVars = new Set();
    let usedVars = new Set();



    lines.forEach((line, index) => {
        const stripped = line.trim();

        // Count brackets to track nesting
        bracketCount += (stripped.match(/{/g) || []).length;
        bracketCount -= (stripped.match(/}/g) || []).length;

        if (bracketCount > indentationLevel) {
            indentationLevel = bracketCount;
        } else if (bracketCount < indentationLevel) {
            indentationLevel = bracketCount;
        }

        // Match class declarations
        const classMatch = stripped.match(/^(open|abstract|sealed|data)?\s*class\s+(\w+)/);
        if (classMatch) {
            outline.push({
                type: 'Class',
                name: classMatch[2],
                loc: { start: { line: index + 1, column: line.indexOf('class') + 1 } },
                indentation: indentationLevel
            });
        }

        // Match interface declarations
        const interfaceMatch = stripped.match(/^interface\s+(\w+)/);
        if (interfaceMatch) {
            outline.push({
                type: 'Interface',
                name: interfaceMatch[1],
                loc: { start: { line: index + 1, column: line.indexOf('interface') + 1 } },
                indentation: indentationLevel
            });
        }

        // Match function declarations
        const functionMatch = stripped.match(/^(fun)\s+(\w+)\s*(\(.*):/);
        if (functionMatch) {
            outline.push({
                type: 'Function',
                name: functionMatch[2],
                loc: { start: { line: index + 1, column: line.indexOf(functionMatch[2]) + 1 } },
                indentation: indentationLevel
            });
        }

        // Match property declarations
        const propertyMatch = stripped.match(/^(val|var)\s+(\w+)(\s*:\s*(\w+))?/);
        if (propertyMatch) {
            outline.push({
                type: 'Property',
                name: propertyMatch[2],
                dataType: propertyMatch[4] || 'inferred',
                loc: { start: { line: index + 1, column: line.indexOf(propertyMatch[2]) + 1 } },
                indentation: indentationLevel
            });
        }

        // Match object declarations
        const objectMatch = stripped.match(/^object\s+(\w+)/);
        if (objectMatch) {
            outline.push({
                type: 'Object',
                name: objectMatch[1],
                loc: { start: { line: index + 1, column: line.indexOf('object') + 1 } },
                indentation: indentationLevel
            });
        }

        // Check for common Kotlin errors
        if (stripped.match(/^\s*var\s+[A-Z]/)) {
            addError(outline, 'NamingConvention', 'Variable names should start with lowercase', index + 1, line.indexOf('var') + 1);
        }
        if (stripped.includes('!!')) {
            addError(outline, 'NullSafety', 'Avoid using !! operator', index + 1, line.indexOf('!!') + 1);
        }
        if (stripped.match(/^\s*if\s*\([^)]*\)\s*[^{]/)) {
            addError(outline, 'StyleWarning', 'Consider using curly braces for if statements', index + 1, line.indexOf('if') + 1);
        }
        // Check for potential null pointer exceptions
        if (stripped.includes('.') && !stripped.includes('?.') && !stripped.includes('!!')) {
            addError(outline, 'NullSafety', 'Potential null pointer exception. Consider using safe call operator (?.).', index + 1, line.indexOf('.') + 1);
        }

        // Check for use of deprecated features
        if (stripped.includes('kotlin.Unit')) {
            addError(outline, 'DeprecationWarning', 'kotlin.Unit is deprecated. Use Unit instead.', index + 1, line.indexOf('kotlin.Unit') + 1);
        }

        // Check for variable declarations and usage
        const varDecl = stripped.match(/(?:val|var)\s+(\w+)/);
        if (varDecl) {
            declaredVars.add(varDecl[1]);
        }

        const varUsage = stripped.match(/\b(\w+)\b/g);
        if (varUsage) {
            varUsage.forEach(v => usedVars.add(v));
        }
    });

    // Check for unused variables
    declaredVars.forEach(v => {
        if (!usedVars.has(v)) {
            addError(outline, 'UnusedWarning', `Unused variable: ${v}`, 1, 1);
        }
    });

    return outline;
}
