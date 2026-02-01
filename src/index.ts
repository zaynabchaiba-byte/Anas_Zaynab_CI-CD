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

program
  .command("delete-vehicle")
  .description("Supprimer un véhicule")
  .argument("<id>", "ID du véhicule")
  .action(async (id: string) => {
    const { address } = program.opts<{ address: string }>();

    try {
      const response = await fetch(`${address}/vehicles/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erreur serveur (${response.status})`);
        if (errorText) {
          console.error(errorText);
        }
        process.exit(1);
      }

      // Certains serveurs répondent 204 No Content
      if (response.status === 204) {
        console.log("Véhicule supprimé avec succès.");
      } else {
        const result = await response.text();
        console.log("Réponse serveur :", result);
      }
    } catch (error) {
      console.error(
        `Impossible de contacter le serveur à ${address}. Vérifie qu'il est lancé.`
      );
      process.exit(1);
    }
  });


program.parse(process.argv);
