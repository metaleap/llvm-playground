various other node progs throughout this repo import **this shared-lib**.

so why have my own, handcoded, merely-a-subset-of LLVM-IR AST classes in here, instead of using one of "the numerous LLVM packages apparently on offer over at NPM"?

same reason as always in the Nodejs universe.. either they're bitrotted / outdated / stale / abandoned / erroring-out-for-FFI-or-other-reasons themselves --- or any of their dependencies. yes, tried them all and yes, wasted precious hours..

this alternative, handwritten layer will last longer than C-Node-FFI bindings depending on shared-object locations and all that clutter. all that's required is for typical LLVM commands (`llvm-as`, `lli`) to be in `PATH` or for LLVM's ASM-ish IR to not change too-superbly-drastically vs. the 6.0.1 I'm currently working off. (maybe 5 years from now it, too, will be out of date --- better than 5 months from now.)
