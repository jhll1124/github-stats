FROM denoland/deno:1.22.2

USER deno

COPY . /stats
WORKDIR /stats

RUN deno cache --import-map=import_map.json src/action.ts

ENTRYPOINT ["deno", "run" , \
"--import-map=import_map.json", \
"--allow-env", \
"--allow-net", \
"--allow-write=.", \
"src/action.ts"]
