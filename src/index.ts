#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program
  .name("vehicle-cli")
  .description("CLI client HTTP pour vehicle-server")
  .requiredOption("-a, --address <url>", "Adresse du serveur (ex: http://localhost:8080)");

program.command("list-vehicles").action(() => {
  console.log("TODO: list-vehicles");
});

program.command("create-vehicle").action(() => {
  console.log("TODO: create-vehicle");
});

program.command("delete-vehicle").argument("<id>").action((id: string) => {
  console.log("TODO: delete-vehicle", id);
});

program.parse(process.argv);

