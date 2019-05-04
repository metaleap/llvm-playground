if ! tsc ; then exit 1 ; fi

clear
# `node ....../index.js` prints out LLVM-IR text, piped to:
# llvm-as translates incoming IR to bitcode, piped to:
# lli runs the main and exit-codes with that call's int return
node ./out/minidemo-23plus42/via-nodejs/src/index.js | llvm-as -f | lli
# print out exit-code int (should be 65, from 42+23)
echo $?
