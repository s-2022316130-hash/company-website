import type { BikeClass, BrakeType, FuelSystem, ModelSpec, ModelStatus, MotorcycleModel, VariantSpec } from "@/lib/types";
import { modelVariants } from "./variants";

/**
 * Motorcycle model directory, checked against official manufacturer sites on 2026-10-02.
 *
 * status:
 *   bd-current     on the brand's official Bangladesh line-up
 *   bd-earlier     older model with an official Bangladesh page, no longer in the line-up
 *   official-other only in the manufacturer's official catalogue outside Bangladesh
 *
 * Names follow the official sites, normalised to title case (e.g. "GIXXER SF" → "Gixxer SF").
 * spec values come from the official model pages and are left out when the page doesn't state them.
 * Where per-variant specs exist (src/data/variants.ts), the model spec is derived from them instead.
 * Listing a model here does NOT mean Nirob Autos stocks parts for it; products say that.
 */

interface Spec {
  f?: BrakeType[];
  r?: BrakeType[];
  fuel?: FuelSystem[];
}

function model(
  brand: string,
  key: string,
  name: string,
  opts: {
    type?: "motorcycle" | "scooter";
    cls: BikeClass;
    status: ModelStatus;
    spec?: Spec;
    source?: string;
    aliases?: string[];
    variant?: string;
  },
): MotorcycleModel {
  const slug = `${brand}-${key}`;
  const variants = modelVariants[slug];
  // Variant names ("pulsar 150 td abs") are searchable spellings of the model.
  const variantNames = (variants ?? []).map((v) => v.name.toLowerCase()).filter((n) => n !== name.toLowerCase());
  const aliases = [...(opts.aliases ?? []), ...variantNames];
  return {
    id: slug,
    slug,
    brand,
    name,
    type: opts.type ?? (opts.cls === "scooter" ? "scooter" : "motorcycle"),
    class: opts.cls,
    status: opts.status,
    spec: variants
      ? specFromVariants(variants)
      : opts.spec
        ? { frontBrake: opts.spec.f, rearBrake: opts.spec.r, fuel: opts.spec.fuel }
        : undefined,
    source: opts.source,
    aliases: aliases.length > 0 ? aliases : undefined,
    variant: opts.variant,
    variants,
  };
}

/** Every brake type and fuel system stated across a model's variants. */
function specFromVariants(variants: VariantSpec[]): ModelSpec {
  const uniq = <T,>(values: (T | undefined)[]) => {
    const set = [...new Set(values.filter((v): v is T => v !== undefined))];
    return set.length > 0 ? set : undefined;
  };
  return {
    frontBrake: uniq(variants.map((v) => v.frontBrake?.type)),
    rearBrake: uniq(variants.map((v) => v.rearBrake?.type)),
    fuel: uniq(variants.map((v) => v.fuel)),
  };
}

const D: BrakeType[] = ["disc"];
const DR: BrakeType[] = ["drum"];
const DD: BrakeType[] = ["disc", "drum"];
const FI: FuelSystem[] = ["fi"];
const CARB: FuelSystem[] = ["carburettor"];

const BAJAJ_BD = "https://www.bajajauto.com/en-bd/bikes/";
const BAJAJ_IN = "https://www.bajajauto.com/bikes/";
const HONDA_BD = "https://www.bdhonda.com/product/";
const YAMAHA_BD = "https://www.yamahabd.com/products/";
const SUZUKI_BD = "https://suzuki.com.bd/product/";
const TVS_BD = "https://bangladesh.tvsmotor.com/en/p/our-products/";
const HERO_BD = "https://www.heromotocorp.com/en-bd/products/";
const RUNNER_BD = "https://motorcycles.runnerautomobiles.com/shop/products/";
const RUNNER_ABOUT = "https://www.runnerbd.com/runner-group/post4.php";

export const models: MotorcycleModel[] = [
  // ── Bajaj ── bajajauto.com/en-bd (Uttara Motors) ──────────────────────────
  model("bajaj", "pulsar-n250", "Pulsar N250", { cls: "street", status: "bd-current", source: `${BAJAJ_BD}pulsar-n250`, aliases: ["n250"] }),
  model("bajaj", "pulsar-f250", "Pulsar F250", { cls: "sport", status: "bd-current", source: `${BAJAJ_BD}pulsar-f250`, aliases: ["f250"] }),
  model("bajaj", "pulsar-n160", "Pulsar N160", { cls: "street", status: "bd-current", source: `${BAJAJ_BD}pulsar-n160`, aliases: ["n160"] }),
  model("bajaj", "pulsar-150", "Pulsar 150", { cls: "street", status: "bd-current", source: `${BAJAJ_BD}pulsar-150-td`, aliases: ["pulsar150", "p150"] }),
  model("bajaj", "pulsar-ns125", "Pulsar NS125", { cls: "street", status: "bd-current", source: `${BAJAJ_BD}pulsar-ns125`, aliases: ["ns125", "ns 125"] }),
  model("bajaj", "discover-125", "Discover 125", { cls: "commuter", status: "bd-current", source: `${BAJAJ_BD}discover-125-disc`, variant: "Disc", aliases: ["discover"] }),
  model("bajaj", "discover-110", "Discover 110", { cls: "commuter", status: "bd-current", source: `${BAJAJ_BD}discover-110-disc`, variant: "Disc" }),
  model("bajaj", "platina-110-h", "Platina 110 H", { cls: "commuter", status: "bd-current", source: `${BAJAJ_BD}platina-110-h`, aliases: ["platina 110", "h gear"] }),
  model("bajaj", "platina-100-es", "Platina 100 ES", { cls: "commuter", status: "bd-current", source: `${BAJAJ_BD}platina-100-es`, aliases: ["platina 100", "platina"] }),
  model("bajaj", "ct-100-es", "CT 100 ES", { cls: "commuter", status: "bd-current", source: `${BAJAJ_BD}ct-100-es`, aliases: ["ct100", "ct 100"] }),
  model("bajaj", "pulsar-ns160", "Pulsar NS160", { cls: "street", status: "official-other", source: `${BAJAJ_IN}pulsar/pulsar-ns160`, aliases: ["ns160", "ns 160"] }),
  model("bajaj", "pulsar-n125", "Pulsar N125", { cls: "street", status: "official-other", source: `${BAJAJ_IN}pulsar/pulsar-n125`, aliases: ["n125"] }),
  model("bajaj", "pulsar-ns200", "Pulsar NS200", { cls: "street", status: "official-other", source: `${BAJAJ_IN}pulsar/pulsar-ns200`, aliases: ["ns200"] }),
  model("bajaj", "pulsar-ns400z", "Pulsar NS400Z", { cls: "street", status: "official-other", source: `${BAJAJ_IN}pulsar/pulsar-ns400z`, aliases: ["ns400", "ns400z"] }),
  model("bajaj", "pulsar-rs200", "Pulsar RS200", { cls: "sport", status: "official-other", source: `${BAJAJ_IN}pulsar/pulsar-rs200`, aliases: ["rs200"] }),
  model("bajaj", "pulsar-180", "Pulsar 180", { cls: "street", status: "official-other", source: `${BAJAJ_IN}pulsar/pulsar-180-2026` }),
  model("bajaj", "pulsar-220f", "Pulsar 220F", { cls: "sport", status: "official-other", source: `${BAJAJ_IN}pulsar/pulsar-220f`, aliases: ["220f", "pulsar 220"] }),
  model("bajaj", "dominar-250", "Dominar 250", { cls: "street", status: "official-other", source: `${BAJAJ_IN}dominar/dominar-250` }),
  model("bajaj", "dominar-400", "Dominar 400", { cls: "street", status: "official-other", source: `${BAJAJ_IN}dominar/dominar-400`, aliases: ["dominar"] }),
  model("bajaj", "avenger-220-street", "Avenger 220 Street", { cls: "cruiser", status: "official-other", source: `${BAJAJ_IN}avenger/avenger-street-220`, aliases: ["avenger street"] }),
  model("bajaj", "avenger-220-cruise", "Avenger 220 Cruise", { cls: "cruiser", status: "official-other", source: `${BAJAJ_IN}avenger/avenger-cruise-220`, aliases: ["avenger cruise", "avenger"] }),
  model("bajaj", "ct-110x", "CT 110X", { cls: "commuter", status: "official-other", source: `${BAJAJ_IN}ct/ct-110x`, aliases: ["ct110x"] }),
  model("bajaj", "freedom-125", "Freedom 125", { cls: "commuter", status: "official-other", source: `${BAJAJ_IN}bajaj-freedom/bajaj-freedom-125-ng04`, aliases: ["freedom", "cng bike"] }),

  // ── Honda ── bdhonda.com (Bangladesh Honda Private Ltd) ────────────────────
  model("honda", "shine-100", "Shine 100", { cls: "commuter", status: "bd-current", spec: { f: DR, r: DR }, source: `${HONDA_BD}shine-100/specifications`, aliases: ["shine"] }),
  model("honda", "shine-100-dx", "Shine 100 DX", { cls: "commuter", status: "bd-current", spec: { f: DR, r: DR }, source: `${HONDA_BD}shine100-dx/specifications`, aliases: ["shine dx"] }),
  model("honda", "dream-110", "Dream 110", { cls: "commuter", status: "bd-current", spec: { f: DR, r: DR }, source: `${HONDA_BD}dream-110/specifications`, aliases: ["dream"] }),
  model("honda", "livo", "Livo", { cls: "commuter", status: "bd-current", spec: { f: D, r: DR }, source: `${HONDA_BD}livo/specifications` }),
  model("honda", "sp-125", "SP 125", { cls: "commuter", status: "bd-current", spec: { f: D, r: DR, fuel: FI }, source: `${HONDA_BD}sp-125/specifications`, aliases: ["sp125"] }),
  model("honda", "sp-160", "SP 160", { cls: "street", status: "bd-current", spec: { f: D, r: DD, fuel: FI }, source: `${HONDA_BD}sp-160/specifications`, aliases: ["sp160"] }),
  model("honda", "xblade", "XBlade", { cls: "street", status: "bd-current", spec: { f: D, r: D, fuel: FI }, source: `${HONDA_BD}xblade/specifications`, aliases: ["x blade", "x-blade"] }),
  model("honda", "hornet-2-0", "Hornet 2.0", { cls: "street", status: "bd-current", spec: { f: D, r: D, fuel: FI }, source: `${HONDA_BD}hornet-2-0/specifications`, aliases: ["hornet", "hornet 2"] }),
  model("honda", "nx200", "NX200", { cls: "offroad", status: "bd-current", spec: { f: D, r: D, fuel: FI }, source: `${HONDA_BD}nx200/specifications`, aliases: ["nx 200"] }),
  model("honda", "cbr-150r", "CBR 150R", { cls: "sport", status: "bd-current", spec: { f: D, r: D }, source: `${HONDA_BD}cbr-150r/specifications`, aliases: ["cbr150", "cbr 150"] }),
  model("honda", "dio", "Dio", { cls: "scooter", status: "bd-current", spec: { f: DR, r: DR }, source: `${HONDA_BD}dio/specifications` }),
  model("honda", "cb-shine", "CB Shine", { cls: "commuter", status: "bd-earlier", source: `${HONDA_BD}cb-shine/about`, aliases: ["cbshine"] }),
  model("honda", "cb-hornet-160r", "CB Hornet 160R", { cls: "street", status: "bd-earlier", source: `${HONDA_BD}cb-hornet-160r/specifications`, aliases: ["hornet 160"] }),

  // ── Yamaha ── yamahabd.com (ACI Motors) ────────────────────────────────────
  model("yamaha", "r15-v4", "R15 V4", { cls: "sport", status: "bd-current", spec: { f: D, r: D, fuel: FI }, source: `${YAMAHA_BD}yamaha-r15-v4`, aliases: ["r15", "r 15 v4"] }),
  model("yamaha", "r15m", "R15 M", { cls: "sport", status: "bd-current", spec: { f: D, r: D, fuel: FI }, source: `${YAMAHA_BD}yamaha-r15m`, aliases: ["r15m"] }),
  model("yamaha", "r15m-monster-edition", "R15M Monster Edition", { cls: "sport", status: "bd-current", spec: { f: D, r: D, fuel: FI }, source: `${YAMAHA_BD}yamaha-r15M-monster-edition`, aliases: ["monster edition"] }),
  model("yamaha", "r15-v3", "R15 V3", { cls: "sport", status: "bd-current", spec: { f: D, r: D, fuel: FI }, source: `${YAMAHA_BD}yamaha-r15-v3` }),
  model("yamaha", "mt15-v2", "MT15 V2", { cls: "street", status: "bd-current", spec: { f: D, r: D, fuel: FI }, source: `${YAMAHA_BD}yamaha-mt-15-v2`, aliases: ["mt-15 v2", "mt15", "mt 15"] }),
  model("yamaha", "mt15-v1", "MT15 V1", { cls: "street", status: "bd-current", spec: { f: D, r: D, fuel: FI }, source: `${YAMAHA_BD}yamaha-mt-15-v1`, aliases: ["mt-15 v1"] }),
  model("yamaha", "fzs-v4", "FZS V4", { cls: "street", status: "bd-current", spec: { f: D, r: D, fuel: FI }, source: `${YAMAHA_BD}yamaha-fzs-v4`, aliases: ["fz v4", "fzs fi v4", "fzsv4", "fz s v4", "fz"] }),
  model("yamaha", "fzs-v2", "FZS V2", { cls: "street", status: "bd-current", spec: { f: D, r: D, fuel: FI }, source: `${YAMAHA_BD}yamaha-fzs-v2`, aliases: ["fz v2", "fzsv2", "fz s v2"] }),
  model("yamaha", "fzs-fi-hybrid", "FZS Fi Hybrid", { cls: "street", status: "bd-current", spec: { f: D, r: D, fuel: FI }, source: `${YAMAHA_BD}yamaha-fzs-fi-hybrid`, aliases: ["fz hybrid", "fzs hybrid"] }),
  model("yamaha", "fz-x", "FZ-X", { cls: "street", status: "bd-current", spec: { f: D, r: D, fuel: FI }, source: `${YAMAHA_BD}yamaha-fz-x`, aliases: ["fzx", "fz x"] }),
  model("yamaha", "fz-25", "FZ-25", { cls: "street", status: "bd-current", spec: { f: D, r: D, fuel: FI }, source: `${YAMAHA_BD}yamaha-fz-25`, aliases: ["fz25", "fz 25"] }),
  model("yamaha", "fazer-fi-v2", "Fazer FI V2", { cls: "sport", status: "bd-current", spec: { f: D, r: DR, fuel: FI }, source: `${YAMAHA_BD}yamaha-fazer-fi-v2`, aliases: ["fazer"] }),
  model("yamaha", "saluto-125", "Saluto 125", { cls: "commuter", status: "bd-current", spec: { f: D, r: DR, fuel: CARB }, source: `${YAMAHA_BD}yamaha-saluto-125-ubs`, aliases: ["saluto"] }),
  model("yamaha", "aerox-155", "Aerox 155", { cls: "scooter", status: "bd-current", spec: { f: D, r: DR, fuel: FI }, source: `${YAMAHA_BD}yamaha-aerox-155`, aliases: ["aerox"] }),
  model("yamaha", "ray-zr-125-fi", "Ray-ZR 125 FI", { cls: "scooter", status: "bd-current", spec: { f: D, r: DR, fuel: FI }, source: `${YAMAHA_BD}yamaha-ray-zr-125`, aliases: ["ray zr", "rayzr"] }),
  model("yamaha", "ray-zr-113", "Ray-ZR 113", { cls: "scooter", status: "bd-current", spec: { f: D, r: DR, fuel: FI }, source: `${YAMAHA_BD}yamaha-ray-zr-street-rally` }),
  model("yamaha", "fascino-125", "Fascino 125", { cls: "scooter", status: "official-other", source: "https://www.yamaha-motor-india.com/yamaha-newfascino125fi.html", aliases: ["fascino"] }),

  // ── Suzuki ── suzuki.com.bd (Rancon Motorbikes) ────────────────────────────
  model("suzuki", "gixxer", "Gixxer", { cls: "street", status: "bd-current", spec: { f: D, r: D, fuel: ["fi", "carburettor"] }, source: `${SUZUKI_BD}gixxer`, aliases: ["gixer", "gixxar"] }),
  model("suzuki", "gixxer-sf", "Gixxer SF", { cls: "sport", status: "bd-current", spec: { f: D, r: D, fuel: FI }, source: `${SUZUKI_BD}gixxer-sf`, aliases: ["gixer sf", "gixxersf"] }),
  model("suzuki", "gixxer-250", "Gixxer 250", { cls: "street", status: "bd-current", spec: { f: D, r: D, fuel: FI }, source: `${SUZUKI_BD}gixxer-250` }),
  model("suzuki", "gixxer-sf-250", "Gixxer SF 250", { cls: "sport", status: "bd-current", spec: { f: D, r: D, fuel: FI }, source: `${SUZUKI_BD}gixxer-sf-250`, aliases: ["sf 250"] }),
  model("suzuki", "gixxer-monotone", "Gixxer Monotone", { cls: "street", status: "bd-current", spec: { f: D, r: DR, fuel: CARB }, source: `${SUZUKI_BD}gixxer-monotone` }),
  model("suzuki", "gixxer-classic-matt", "Gixxer Classic Matt", { cls: "street", status: "bd-current", spec: { f: D, fuel: CARB }, source: `${SUZUKI_BD}gixxer-classic-matt`, aliases: ["gixxer classic"] }),
  model("suzuki", "gsx-r150", "GSX-R150", { cls: "sport", status: "bd-current", spec: { f: D, r: D, fuel: FI }, source: `${SUZUKI_BD}gsx-r150`, aliases: ["gsxr150", "gsx r150"] }),
  model("suzuki", "gsx-125", "GSX 125", { cls: "commuter", status: "bd-current", spec: { f: D, r: DR, fuel: CARB }, source: `${SUZUKI_BD}gsx-125`, aliases: ["gsx125"] }),
  model("suzuki", "hayate-ep", "Hayate EP", { cls: "commuter", status: "bd-current", spec: { f: DR, r: DR, fuel: CARB }, source: `${SUZUKI_BD}hayate-ep`, aliases: ["hayate"] }),
  model("suzuki", "access-125", "Access 125", { cls: "scooter", status: "bd-current", spec: { f: D, r: DR, fuel: FI }, source: `${SUZUKI_BD}access-125`, aliases: ["access"] }),
  model("suzuki", "burgman-street", "Burgman Street", { cls: "scooter", status: "official-other", source: "https://www.suzukimotorcycle.co.in/product-details/burgman-street", aliases: ["burgman"] }),

  // ── TVS ── bangladesh.tvsmotor.com ─────────────────────────────────────────
  model("tvs", "apache-rtr-160-4v", "Apache RTR 160 4V", { cls: "street", status: "bd-current", spec: { f: D, r: DD, fuel: CARB }, source: `${TVS_BD}rtr-160-4v-bd`, aliases: ["apache 4v", "rtr 4v", "apache 160 4v", "rtr160"] }),
  model("tvs", "apache-rtr-160-2v", "Apache RTR 160 2V Refresh", { cls: "street", status: "bd-current", spec: { f: D, r: DD, fuel: CARB }, source: `${TVS_BD}apache-rtr-160-2v-refresh-bd`, aliases: ["apache 2v", "rtr 2v", "apache 160", "apache"] }),
  model("tvs", "raider-125", "Raider 125", { cls: "commuter", status: "bd-current", spec: { f: D, r: DR, fuel: CARB }, source: `${TVS_BD}tvs-raider-bd`, aliases: ["raider"] }),
  model("tvs", "ntorq-125-re", "Ntorq 125 RE", { cls: "scooter", status: "bd-current", spec: { f: D, r: DR }, source: `${TVS_BD}ntorq-125-re-bd`, aliases: ["ntorq"] }),
  model("tvs", "metro-plus-110", "Metro Plus 110", { cls: "commuter", status: "bd-earlier", source: "https://www.tvsmotor.com/media/press-release/tvs-motor-company-launches-new-tvs-metro-plus-110-in-bangladesh", aliases: ["metro plus", "metro"] }),
  model("tvs", "apache-rtr-200-4v", "Apache RTR 200 4V", { cls: "street", status: "official-other", source: "https://www.tvsmotor.com/tvs-apache/apache-rtr-200-4v", aliases: ["rtr 200", "apache 200"] }),
  model("tvs", "apache-rtr-310", "Apache RTR 310", { cls: "street", status: "official-other", source: "https://www.tvsmotor.com/tvs-apache/apache-rtr-310", aliases: ["rtr 310"] }),
  model("tvs", "apache-rr-310", "Apache RR 310", { cls: "sport", status: "official-other", source: "https://www.tvsmotor.com/tvs-apache/rr-310", aliases: ["rr 310", "rr310"] }),
  model("tvs", "ronin", "Ronin", { cls: "street", status: "official-other", source: "https://www.tvsmotor.com/tvs-ronin" }),
  model("tvs", "stryker-125", "Stryker 125", { cls: "commuter", status: "official-other", source: "https://www.tvsmotor.com/en/sv/our-products/tvs-stryker", aliases: ["stryker"] }),
  model("tvs", "hlx-125", "HLX 125", { cls: "commuter", status: "official-other", source: "https://www.tvsmotor.com/en/tz/our-products/tvs-hlx-125-5G", aliases: ["hlx"] }),

  // ── Hero ── heromotocorp.com/en-bd (HMCL Niloy Bangladesh) ────────────────────
  model("hero", "splendor-plus-se", "Splendor+ SE", { cls: "commuter", status: "bd-current", spec: { f: DR, r: DR }, source: `${HERO_BD}commuter/splendor-plus.html`, aliases: ["splendor plus", "splendor", "splender"] }),
  model("hero", "splendor-plus-xtec", "Splendor+ Xtec", { cls: "commuter", status: "bd-current", spec: { f: DR, r: DR }, source: `${HERO_BD}commuter/splendor-plus-xtec.html`, aliases: ["splendor xtec"] }),
  model("hero", "splendor-plus-xtec-2-0", "Splendor+ Xtec 2.0", { cls: "commuter", status: "bd-current", spec: { f: DR, r: DR }, source: `${HERO_BD}commuter/splendor-plus-xtec-2-0.html` }),
  model("hero", "splendor-plus-sports", "Splendor+ Sports", { cls: "commuter", status: "bd-current", spec: { f: DR, r: DR }, source: `${HERO_BD}commuter/splendor-plus-sports.html` }),
  model("hero", "hf-deluxe", "HF Deluxe", { cls: "commuter", status: "bd-current", spec: { f: DR, r: DR, fuel: CARB }, source: `${HERO_BD}commuter/hf-deluxe.html`, aliases: ["hf", "deluxe"] }),
  model("hero", "hf-deluxe-new", "HF Deluxe New", { cls: "commuter", status: "bd-current", spec: { f: DR, r: DR }, source: `${HERO_BD}commuter/hf-deluxe-new.html` }),
  model("hero", "passion-xpro", "Passion Xpro", { cls: "commuter", status: "bd-current", spec: { r: DR }, source: `${HERO_BD}commuter/passion-xpro.html`, aliases: ["passion"] }),
  model("hero", "passion-xpro-xtec", "Passion Xpro Xtec", { cls: "commuter", status: "bd-current", spec: { r: DR }, source: `${HERO_BD}commuter/passion-xpro-xtec.html` }),
  model("hero", "glamour", "Glamour", { cls: "commuter", status: "bd-current", spec: { f: DD, r: DR }, source: `${HERO_BD}executive/glamour.html`, aliases: ["glamor"] }),
  model("hero", "glamour-x", "Glamour X", { cls: "commuter", status: "bd-current", spec: { fuel: FI }, source: `${HERO_BD}executive/glamour-x.html` }),
  model("hero", "ignitor-techno", "Ignitor Techno", { cls: "commuter", status: "bd-current", spec: { f: D, r: DR, fuel: CARB }, source: `${HERO_BD}executive/ignitor-techno.html`, aliases: ["ignitor"] }),
  model("hero", "ignitor-xtec", "Ignitor Xtec", { cls: "commuter", status: "bd-current", spec: { f: D, r: DR, fuel: CARB }, source: `${HERO_BD}executive/ignitor-xtec.html` }),
  model("hero", "xtreme-125r", "Xtreme 125R", { cls: "street", status: "bd-current", spec: { f: D, r: DR, fuel: FI }, source: `${HERO_BD}executive/xtreme-125r.html`, aliases: ["xtreme 125"] }),
  model("hero", "hunk-150", "Hunk 150", { cls: "street", status: "bd-current", spec: { f: D, r: D, fuel: CARB }, source: `${HERO_BD}premium/hunk.html`, aliases: ["hunk"] }),
  model("hero", "hunk-150r", "Hunk 150R", { cls: "street", status: "bd-current", spec: { f: D, r: D, fuel: CARB }, source: `${HERO_BD}premium/hunk-150r.html`, aliases: ["hunk 150 r"] }),
  model("hero", "hunk-150-xtec", "Hunk 150 Xtec", { cls: "street", status: "bd-current", spec: { f: D, r: D }, source: `${HERO_BD}premium/hunk-150-xtec.html` }),
  model("hero", "thriller-160r", "Thriller 160R", { cls: "street", status: "bd-current", spec: { f: D, r: DD, fuel: FI }, source: `${HERO_BD}premium/thriller-160r.html`, aliases: ["thriller"] }),
  model("hero", "thriller-160r-4v", "Thriller 160R 4V", { cls: "street", status: "bd-current", spec: { f: D, r: D, fuel: FI }, source: `${HERO_BD}premium/thriller-160r-4v.html` }),
  model("hero", "xtreme-160r-4v", "Xtreme 160R 4V", { cls: "street", status: "bd-current", spec: { f: D, r: D }, source: `${HERO_BD}premium/xtreme-160r-4v.html`, aliases: ["xtreme 160", "xtreme"] }),
  model("hero", "karizma-xmr", "Karizma XMR", { cls: "sport", status: "bd-current", spec: { f: D, r: D, fuel: FI }, source: `${HERO_BD}KarizmaXMR.html`, aliases: ["karizma"] }),
  model("hero", "xpulse-200-4v", "Xpulse 200 4V", { cls: "offroad", status: "bd-current", spec: { f: D, r: D }, source: `${HERO_BD}premium/xpulse-200-4v.html`, aliases: ["xpulse"] }),
  model("hero", "pleasure", "Pleasure", { cls: "scooter", status: "bd-current", spec: { f: DR, r: DR }, source: `${HERO_BD}scooter/pleasure.html` }),
  model("hero", "maestro-edge-xtec", "Maestro Edge Xtec", { cls: "scooter", status: "bd-current", source: `${HERO_BD}scooter/maestro-edge.html`, aliases: ["maestro"] }),
  model("hero", "xoom-110", "Xoom 110", { cls: "scooter", status: "bd-current", spec: { f: DD, r: DR, fuel: CARB }, source: `${HERO_BD}scooter/xoom-110.html`, aliases: ["xoom"] }),
  model("hero", "xoom-125r-fi", "Xoom 125R FI", { cls: "scooter", status: "bd-current", spec: { f: D, r: DR, fuel: FI }, source: `${HERO_BD}scooter/xoom-125r-fi.html` }),
  model("hero", "hunk-160r-4v", "Hunk 160R 4V", { cls: "street", status: "official-other", source: "https://www.heromotocorp.com/en-lk/products/premium/hunk-160r-4v.html", aliases: ["hunk 160"] }),

  // ── Runner (motorcycles.runnerautomobiles.com shop listing; UM-branded bikes excluded) ──
  model("runner", "bullet-100", "Bullet 100", { cls: "commuter", status: "bd-current", spec: { f: D, r: DR }, source: `${RUNNER_BD}bullet-100cc-red-1`, aliases: ["bullet"] }),
  model("runner", "bullet-100-v2", "Bullet 100 V2", { cls: "commuter", status: "bd-current", spec: { f: D, r: DR }, source: `${RUNNER_BD}bullet-100cc-v2-white`, aliases: ["bullet v2"] }),
  model("runner", "royal-plus-110", "Royal+ 110", { cls: "commuter", status: "bd-current", spec: { f: D, r: DR }, source: `${RUNNER_BD}royal-110cc-red`, aliases: ["royal plus", "royal 110", "royal"] }),
  model("runner", "turbo-125", "Turbo 125", { cls: "commuter", status: "bd-current", spec: { f: D, r: DR }, source: `${RUNNER_BD}turbo-125cc-matt-blue`, aliases: ["turbo"] }),
  model("runner", "cheeta-100", "Cheeta 100", { cls: "commuter", status: "bd-current", spec: { f: DR, r: DR }, source: `${RUNNER_BD}cheeta`, aliases: ["cheeta", "cheetah"] }),
  model("runner", "f100-6a", "F100-6A", { cls: "commuter", status: "bd-current", spec: { f: DR, r: DR }, source: `${RUNNER_BD}f100-6a-100cc-red-1`, aliases: ["f100", "f 100"] }),
  model("runner", "ad80s-deluxe", "AD80S Deluxe", { cls: "commuter", status: "bd-current", spec: { f: DR, r: DR }, source: `${RUNNER_BD}ad80s-deluxe-1`, aliases: ["ad 80", "ad80", "ad 80s deluxe"] }),
  model("runner", "ad80s-alloy", "AD80S Alloy", { cls: "commuter", status: "bd-current", spec: { f: DR, r: DR }, source: `${RUNNER_BD}ad-80s-alloy`, aliases: ["ad 80s alloy"] }),
  model("runner", "bike-rt-80", "Bike RT 80", { cls: "commuter", status: "bd-current", spec: { f: DR, r: DR }, source: `${RUNNER_BD}bike-rt-80cc`, aliases: ["rt 80"] }),
  // Kite+ is a geared step-through (4-speed gearbox on the official page), not a CVT scooter.
  model("runner", "kite-plus-110", "Kite+ 110", { cls: "commuter", status: "bd-current", spec: { f: D, r: DR }, source: `${RUNNER_BD}kite-110`, aliases: ["kite plus", "kite"] }),
  model("runner", "skooty-110", "Skooty 110", { cls: "scooter", status: "bd-current", spec: { f: D, r: DR }, source: `${RUNNER_BD}runner-skooty-110cc-yellow`, aliases: ["skooty", "scooty"] }),
  model("runner", "knight-rider-150", "Knight Rider 150", { cls: "street", status: "bd-current", spec: { f: D, r: DR }, source: `${RUNNER_BD}knight-rider-150cc`, aliases: ["knight rider"] }),
  model("runner", "knight-rider-v2-150", "Knight Rider V2 150", { cls: "street", status: "bd-current", spec: { f: D, r: D }, source: `${RUNNER_BD}runner-knight-rider-150cc-v2-matte-red`, aliases: ["knight rider v2"] }),
  model("runner", "xtreet-150", "Xtreet 150", { cls: "street", status: "bd-current", spec: { f: D, r: D }, source: `${RUNNER_BD}xtreet-150-151`, aliases: ["xtreet", "street 150"] }),
  model("runner", "bolt-165r", "Bolt 165R", { cls: "street", status: "bd-current", spec: { f: D, r: D }, source: `${RUNNER_BD}bolt165r-red-black`, aliases: ["bolt", "bolt 165"] }),
  // Named on Runner Group's official About page but no longer in the shop listing.
  model("runner", "duranto", "Duranto", { cls: "commuter", status: "bd-earlier", source: RUNNER_ABOUT }),
  model("runner", "turbo-racer-150", "Turbo Racer 150", { cls: "street", status: "bd-earlier", source: RUNNER_ABOUT, aliases: ["turbo racer"] }),
];
