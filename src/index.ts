#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program
  .name("vehicle-cli")
  .description("CLI client HTTP pour vehicle-server")
  .requiredOption("-a, --address <url>", "Adresse du serveur (ex: http://localhost:8080)");

program.command("list-vehicles").description("Lister les vehicules").action(async () => {
  const { address } = program.opts<{ address: string }>();

  try {
    const resp = await fetch(`${address}/vehicles`);

    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      console.error(`Erreur serveur (${resp.status})`);
      if (errText) console.error(errText);
      process.exit(1);
    }

    const data = await resp.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Impossible de contacter le serveur :", e);
    process.exit(1);
  }
});


program.command("create-vehicle").action(() => {
  console.log("TODO: create-vehicle");
});

program.command("delete-vehicle").argument("<id>").action((id: string) => {
  console.log("TODO: delete-vehicle", id);
});

program.parse(process.argv);

