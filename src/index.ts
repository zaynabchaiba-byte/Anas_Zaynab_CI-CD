#!/usr/bin/env node
import { Command } from "commander";
import { VehicleClient, type Vehicle } from "./http/client";
import { HttpError } from "./utils/errors";

const program = new Command();

program
  .name("vehicle-cli")
  .description("CLI client HTTP pour vehicle-server")
  .requiredOption("-a, --address <url>", "Adresse du serveur (ex: http://localhost:8080)");

function printHttpError(e: unknown, fallbackLabel: string) {
  if (e instanceof HttpError) {
    console.error(`${fallbackLabel} (HTTP ${e.status})`);
    const body = (e.body ?? "").trim();
    if (body) {
      // On affiche le texte serveur tel quel 
      console.error(body);
    }
  } else {
    console.error(`${fallbackLabel} :`, e);
  }
}

function formatTable(vehicles: Vehicle[]): string {
  if (vehicles.length === 0) return "Aucun véhicule.";

  const headers = ["ID", "Shortcode", "Battery", "Latitude", "Longitude"];

  const rows = vehicles.map(v => [
    String(v.id),
    v.shortcode,
    `${v.battery}%`,
    String(v.latitude),
    String(v.longitude)
  ]);

  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map(r => r[i].length))
  );

  const pad = (s: string, w: number) => s + " ".repeat(Math.max(0, w - s.length));

  const line = (cells: string[]) =>
    "| " + cells.map((c, i) => pad(c, widths[i])).join(" | ") + " |";

  const sep = "|-" + widths.map(w => "-".repeat(w)).join("-|-") + "-|";

  return [line(headers), sep, ...rows.map(line)].join("\n");
}

/**
 * LIST
 */
program
  .command("list-vehicles")
  .description("Lister les véhicules")
  .option("--json", "Afficher en JSON (au lieu du tableau)")
  .action(async (opts: { json?: boolean }) => {
    const { address } = program.opts<{ address: string }>();
    const client = new VehicleClient(address);

    try {
      const vehicles = await client.listVehicles();
      if (opts.json) {
        console.log(JSON.stringify(vehicles, null, 2));
      } else {
        console.log(formatTable(vehicles));
      }
    } catch (e) {
      printHttpError(e, "Impossible de lister les véhicules");
      process.exit(1);
    }
  });

/**
 * CREATE
 */
program
  .command("create-vehicle")
  .description("Créer un véhicule")
  .requiredOption("--shortcode <code>", "Shortcode (ex: abcd)")
  .requiredOption("--battery <n>", "Niveau de batterie (0-100)")
  .requiredOption("--latitude <n>", "Latitude")
  .requiredOption("--longitude <n>", "Longitude")
  .action(async (opts: { shortcode: string; battery: string; latitude: string; longitude: string }) => {
    const { address } = program.opts<{ address: string }>();
    const client = new VehicleClient(address);

    const battery = Number(opts.battery);
    const latitude = Number(opts.latitude);
    const longitude = Number(opts.longitude);

    try {
      const v = await client.createVehicle({
        shortcode: String(opts.shortcode),
        battery,
        latitude,
        longitude
      });

      console.log(`Created vehicle \`${v.shortcode}\`, with ID \`${v.id}\``);
    } catch (e) {
      // Exigence du sujet : afficher les erreurs serveur
      console.log("Could not create the vehicle");
      if (e instanceof HttpError) {
        const body = (e.body ?? "").trim();
        if (body) {
          // Si le serveur renvoie un texte contenant des erreurs, on le montre.
          // on essaye d'afficher en mode liste si on détecte des lignes.
          const lines = body.split("\n").map(s => s.trim()).filter(Boolean);
          console.log();
          if (lines.length === 1) {
            console.log(`- ${lines[0]}`);
          } else {
            for (const line of lines) console.log(`- ${line}`);
          }
        } else {
          console.log();
          console.log(`- HTTP ${e.status}`);
        }
      } else {
        console.log();
        console.log("- Unknown error");
      }
      process.exit(1);
    }
  });

/**
 * DELETE
 */
program
  .command("delete-vehicle")
  .description("Supprimer un véhicule")
  .argument("<id>", "ID du véhicule")
  .action(async (id: string) => {
    const { address } = program.opts<{ address: string }>();
    const client = new VehicleClient(address);

    const vehicleId = Number(id);
    if (!Number.isFinite(vehicleId)) {
      console.error("ID invalide (doit être un nombre).");
      process.exit(1);
    }

    try {
      await client.deleteVehicle(vehicleId);
      console.log(`Deleted vehicle with ID \`${vehicleId}\``);
    } catch (e) {
      printHttpError(e, "Impossible de supprimer le véhicule");
      process.exit(1);
    }
  });

program.parse(process.argv);
