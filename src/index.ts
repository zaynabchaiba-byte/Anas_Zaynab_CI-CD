#!/usr/bin/env node
import { Command } from "commander";
import { createVehicle, deleteVehicle, listVehicles } from "./http/client";
import { HttpError, extractErrorLines } from "./utils/errors";

function requireAddress(address?: string): string {
  if (!address) {
    console.error("Error: --address is required (do not hardcode localhost:8080).");
    process.exit(1);
  }
  return address;
}

function prettyPrint(data: unknown) {
  console.log(JSON.stringify(data, null, 2));
}

function handleUnknownError(e: unknown) {
  // TypeScript: catch(e) => unknown, donc on type-guard
  if (e instanceof HttpError) {
    console.error(`Erreur serveur (${e.status})`);
    const lines = extractErrorLines(e.body);
    for (const line of lines) console.error(line);
    process.exit(1);
  }

  if (e instanceof Error) {
    console.error("Erreur:", e.message);
    process.exit(1);
  }

  console.error("Erreur inattendue:", e);
  process.exit(1);
}

const program = new Command();

program
  .name("vehicle")
  .description("CLI client for vehicle-server")
  .option("--address <url>", "server base url (e.g. http://localhost:8080)");

program
  .command("list")
  .description("List vehicles")
  .action(async () => {
    const opts = program.opts<{ address?: string }>();
    const address = requireAddress(opts.address);

    try {
      const vehicles = await listVehicles(address);
      prettyPrint(vehicles);
    } catch (e: unknown) {
      handleUnknownError(e);
    }
  });

program
  .command("create")
  .description("Create a vehicle (send JSON payload)")
  .requiredOption("--data <json>", 'vehicle JSON payload, e.g. \'{"brand":"BMW","model":"X5"}\'')
  .action(async (cmdOpts: { data: string }) => {
    const opts = program.opts<{ address?: string }>();
    const address = requireAddress(opts.address);

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(cmdOpts.data);
    } catch {
      console.error("Error: --data must be valid JSON.");
      process.exit(1);
    }

    try {
      const created = await createVehicle(address, payload);
      prettyPrint(created);
    } catch (e: unknown) {
      handleUnknownError(e);
    }
  });

program
  .command("delete")
  .description("Delete a vehicle by id")
  .requiredOption("--id <id>", "vehicle id")
  .action(async (cmdOpts: { id: string }) => {
    const opts = program.opts<{ address?: string }>();
    const address = requireAddress(opts.address);

    try {
      const result = await deleteVehicle(address, cmdOpts.id);
      prettyPrint(result);
    } catch (e: unknown) {
      handleUnknownError(e);
    }
  });

program.parse();
