import type { MotorcycleModel } from "@/lib/types";

/**
 * Motorcycle models used for compatibility and the part finder.
 * Review this list against the models Nirob Autos actually stocks parts for.
 * Year ranges are deliberately left empty until confirmed.
 */
function model(brand: string, key: string, name: string, extra: Partial<MotorcycleModel> = {}): MotorcycleModel {
  const slug = `${brand}-${key}`;
  return { id: slug, slug, brand, name, ...extra };
}

export const models: MotorcycleModel[] = [
  model("bajaj", "pulsar-150", "Pulsar 150", { aliases: ["pulsar150", "p150"] }),
  model("bajaj", "pulsar-n160", "Pulsar N160", { aliases: ["n160"] }),
  model("bajaj", "pulsar-ns160", "Pulsar NS160", { aliases: ["ns160", "ns 160"] }),
  model("bajaj", "discover-125", "Discover 125", { aliases: ["discover"] }),
  model("bajaj", "platina-100", "Platina 100", { aliases: ["platina"] }),

  model("honda", "cb-shine", "CB Shine", { aliases: ["shine", "cbshine"] }),
  model("honda", "livo", "Livo"),
  model("honda", "cb-hornet-160r", "CB Hornet 160R", { aliases: ["hornet", "hornet 160"] }),
  model("honda", "x-blade", "X-Blade", { aliases: ["xblade", "x blade"] }),

  model("yamaha", "fzs-v2", "FZS V2", { variant: "V2", aliases: ["fz v2", "fzs v2", "fzsv2", "fz s v2"] }),
  model("yamaha", "fzs-v3", "FZS V3", { variant: "V3", aliases: ["fz v3", "fzs v3", "fzsv3", "fz s v3"] }),
  model("yamaha", "r15-v3", "R15 V3", { variant: "V3", aliases: ["r15", "r 15"] }),
  model("yamaha", "mt-15", "MT-15", { aliases: ["mt15", "mt 15"] }),

  model("suzuki", "gixxer", "Gixxer", { aliases: ["gixer", "gixxar"] }),
  model("suzuki", "gixxer-sf", "Gixxer SF", { aliases: ["gixer sf", "gixxersf"] }),
  model("suzuki", "hayate", "Hayate"),

  model("tvs", "apache-rtr-160", "Apache RTR 160", { aliases: ["apache", "rtr 160", "rtr160"] }),
  model("tvs", "apache-rtr-160-4v", "Apache RTR 160 4V", { variant: "4V", aliases: ["apache 4v", "rtr 4v"] }),
  model("tvs", "metro-plus", "Metro Plus", { aliases: ["metro"] }),

  model("hero", "splendor-plus", "Splendor Plus", { aliases: ["splendor", "splender"] }),
  model("hero", "hf-deluxe", "HF Deluxe", { aliases: ["hf", "deluxe"] }),
  model("hero", "glamour", "Glamour", { aliases: ["glamor"] }),

  model("runner", "bullet-100", "Bullet 100", { aliases: ["bullet"] }),
  model("runner", "turbo-125", "Turbo 125", { aliases: ["turbo"] }),
  model("runner", "knight-rider-150", "Knight Rider 150", { aliases: ["knight rider"] }),
];
