if ! tsc ; then exit 1 ; fi

clear
# `node src/index.js` prints out LLVM-IR text, piped to:
# llvm-as translates incoming IR to bitcode, piped to:
# lli runs the main and exit-codes with that call's int return
node src/index.js | llvm-as -f | lli
# print out exit-code int (should be 65, from 42+23)
echo $?
