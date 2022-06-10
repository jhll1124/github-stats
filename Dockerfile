FROM denoland/deno:1.22.2

USER deno

COPY . /action
WORKDIR /action

RUN deno cache --import-map=import_map.json /action/src/action.ts

ENTRYPOINT ["deno", "run" , \
"--import-map=import_map.json", \
"--allow-env", \
"--allow-net", \
"--allow-write=.", \
"/action/src/action.ts"]
