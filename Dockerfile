FROM denoland/deno:1.22.2

COPY . /github-stats
WORKDIR /github-stats

# RUN ["deno", "cache" ,"--import-map=/github-stats/import_map.json", "/github-stats/src/action.ts"]

ENTRYPOINT ["deno", "run" , \
"--import-map=/github-stats/import_map.json", \
"--allow-env", \
"--allow-net", \
"--allow-read=/github/workflow,/github/file_commands", \
"--allow-write=/github/file_commands", \
"/github-stats/src/action.ts"]
