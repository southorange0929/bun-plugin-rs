import { plugin } from "bun";

plugin({
  name: "YAML",
  async setup(build) {
    const { dlopen, FFIType, suffix } = await import("bun:ffi");
    const { execSync } = await import('child_process');
    const path = `libadd.${suffix}`;

    build.onLoad({ filter: /.rs$/ }, (args) => {
      execSync('rustc --crate-type cdylib add.rs')
      const {
        symbols: { add },
      } = dlopen(path, {
        add: {
          args: [FFIType.i32, FFIType.i32],
          returns: FFIType.i32,
        },
      });

      return {
        exports: { add },
        loader: "object",
      };
    });
  },
});
