#!/usr/bin/env node
import { Command } from "commander";
import { VehicleClient } from "./http/client";
import { HttpError } from "./utils/errors";

const program = new Command();

program
  .name("vehicle-cli")
  .description("CLI client HTTP pour vehicle-server")
  .requiredOption("-a, --address <url>", "Adresse du serveur (ex: http://localhost:8080)");

program
  .command("list-vehicles")
  .description("Lister les vehicules")
  .action(async () => {
    const { address } = program.opts<{ address: string }>();
    const client = new VehicleClient(address);

    try {
      const vehicles = await client.listVehicles();
      console.log(JSON.stringify(vehicles, null, 2));
    } catch (e) {
      if (e instanceof HttpError) {
        console.error(`Erreur serveur (${e.status})`);
        if (e.body) console.error(e.body);
      } else {
        console.error("Impossible de contacter le serveur :", e);
      }
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
