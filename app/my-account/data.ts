export const CERTS = ["ASC","BAP","Organic","GlobalG.A.P.","HACCP","Rainforest","Fair Trade"];
export const PROCESSES = ["Fresh","Frozen","Processed","Whole","Peeled"];
export const COUNTRIES = ["Ecuador","Peru","Colombia","Mexico","Chile"];
export const HARVESTS = ["Within 2 weeks","Within 1 month","Within 3 months"];
export const ALL_PRES = ["HLSO","PD","HOSO","PUD"];
export const ALL_PROC = ["IQF Frozen","Block Frozen","Fresh"];
export const ALL_PACK = ["1kg bag","5kg bag","10kg carton"];

export const MOCK_PRODUCERS: Record<string, any[]> = {
  "Vannamei Shrimp": [
    { id:1, nombre:"Aquafarm El Guabo", country:"Ecuador", region:"Gulf of Guayaquil", anos_experiencia:14, certificaciones:["ASC","BAP","HACCP"], procesos:["IQF Frozen","Block Frozen"], presentaciones:["HLSO","PD"], packaging:["1kg bag","5kg bag","10kg carton"], tallas:[{label:"15g",precio:3.85},{label:"18g",precio:4.10},{label:"20g",precio:4.20},{label:"25g",precio:4.35},{label:"30g",precio:null},{label:"40g+",precio:null}], volumen_minimo:2, volumen_disponible:40, proxima_cosecha:"2026-04-05", lead_time:"7-10 days", empacadora_nombre:"Empacadora El Guabo S.A.", empacadora_certs:["FDA","BRC","ISO 22000"], empacadora_ano:2008, consolidaciones:[{puerto:"Rotterdam, Netherlands",slots:8,total:22,fecha:"Apr 15",status:"open"},{puerto:"Hamburg, Germany",slots:19,total:22,fecha:"Apr 10",status:"closing"}] },
    { id:2, nombre:"Mar Pacifico S.A.", country:"Ecuador", region:"Pacific Coast", anos_experiencia:22, certificaciones:["ASC","BAP","GlobalG.A.P.","HACCP"], procesos:["IQF Frozen","Block Frozen","Fresh"], presentaciones:["HLSO","PD"], packaging:["5kg bag","10kg carton"], tallas:[{label:"15g",precio:3.90},{label:"18g",precio:4.15},{label:"20g",precio:4.20},{label:"25g",precio:null},{label:"30g",precio:null},{label:"40g+",precio:null}], volumen_minimo:5, volumen_disponible:80, proxima_cosecha:"2026-04-12", lead_time:"10-14 days", empacadora_nombre:"Pacifico Export S.A.", empacadora_certs:["FDA","HACCP"], empacadora_ano:2005, consolidaciones:[] },
    { id:3, nombre:"Camaronera Manabi", country:"Ecuador", region:"Manabi", anos_experiencia:8, certificaciones:["BAP","HACCP"], procesos:["IQF Frozen"], presentaciones:["HLSO"], packaging:["1kg bag","5kg bag"], tallas:[{label:"15g",precio:3.70},{label:"18g",precio:3.90},{label:"20g",precio:4.00},{label:"25g",precio:4.10},{label:"30g",precio:null},{label:"40g+",precio:null}], volumen_minimo:1, volumen_disponible:20, proxima_cosecha:"2026-04-20", lead_time:"7-10 days", empacadora_nombre:"Empacadora Manabi", empacadora_certs:["HACCP"], empacadora_ano:2015, consolidaciones:[] },
    { id:4, nombre:"Ecuamar Premium", country:"Ecuador", region:"El Oro", anos_experiencia:18, certificaciones:["ASC","BAP","Organic","HACCP"], procesos:["IQF Frozen","Block Frozen"], presentaciones:["HLSO","PD"], packaging:["1kg bag","5kg bag","10kg carton"], tallas:[{label:"15g",precio:4.00},{label:"18g",precio:4.20},{label:"20g",precio:4.35},{label:"25g",precio:4.50},{label:"30g",precio:null},{label:"40g+",precio:null}], volumen_minimo:3, volumen_disponible:60, proxima_cosecha:"2026-05-01", lead_time:"10 days", empacadora_nombre:"Ecuamar Packing", empacadora_certs:["FDA","BRC","ISO 22000"], empacadora_ano:2003, consolidaciones:[{puerto:"Rotterdam, Netherlands",slots:5,total:22,fecha:"May 5",status:"open"}] },
    { id:5, nombre:"Aquacultura del Sur", country:"Ecuador", region:"Pacific Coast", anos_experiencia:11, certificaciones:["BAP","GlobalG.A.P.","HACCP"], procesos:["IQF Frozen","Block Frozen"], presentaciones:["HLSO","PD"], packaging:["5kg bag","10kg carton"], tallas:[{label:"15g",precio:3.80},{label:"18g",precio:4.05},{label:"20g",precio:4.15},{label:"25g",precio:4.25},{label:"30g",precio:null},{label:"40g+",precio:null}], volumen_minimo:2, volumen_disponible:35, proxima_cosecha:"2026-04-08", lead_time:"7-10 days", empacadora_nombre:"Sur Export Packing", empacadora_certs:["FDA","HACCP"], empacadora_ano:2012, consolidaciones:[] },
    { id:6, nombre:"Esmeraldas Shrimp Co.", country:"Ecuador", region:"Esmeraldas", anos_experiencia:6, certificaciones:["BAP","Fair Trade"], procesos:["IQF Frozen"], presentaciones:["HLSO"], packaging:["1kg bag","5kg bag"], tallas:[{label:"15g",precio:3.60},{label:"18g",precio:3.80},{label:"20g",precio:3.90},{label:"25g",precio:null},{label:"30g",precio:null},{label:"40g+",precio:null}], volumen_minimo:1, volumen_disponible:15, proxima_cosecha:"2026-04-15", lead_time:"7 days", empacadora_nombre:"Esmeraldas Packing", empacadora_certs:["HACCP"], empacadora_ano:2018, consolidaciones:[] },
  ],
};

export const allProducts = [
  { name:"Vannamei Shrimp", cat:"Seafood", price:"$4.20/kg", season:"Year-round" },
  { name:"Tilapia Fillet", cat:"Seafood", price:"$2.40/kg", season:"Year-round" },
  { name:"Dragon Fruit", cat:"Fruits", price:"$1.80/kg", season:"Apr-Oct" },
  { name:"Organic Banana", cat:"Fruits", price:"$0.62/kg", season:"Year-round" },
  { name:"Mango Tommy", cat:"Fruits", price:"$1.20/kg", season:"Jan-Apr" },
  { name:"Cacao", cat:"Agro", price:"$3.10/kg", season:"Year-round" },
];

export const prices = [
  { name:"Vannamei Shrimp", cat:"Seafood", price:"$4.20/kg", change:"+1.2%", up:true },
  { name:"Dragon Fruit", cat:"Fruits", price:"$1.80/kg", change:"-0.5%", up:false },
  { name:"Organic Banana", cat:"Fruits", price:"$0.62/kg", change:"+0.8%", up:true },
  { name:"Cacao", cat:"Agro", price:"$3.10/kg", change:"+2.1%", up:true },
  { name:"Mango Tommy", cat:"Fruits", price:"$1.20/kg", change:"+0.6%", up:true },
];

export const documents = [
  { name:"Bill of Lading", ref:"CONS-2026-ROT-0042", date:"Mar 10, 2026", type:"bl" },
  { name:"Commercial Invoice", ref:"CONS-2026-ROT-0042", date:"Mar 8, 2026", type:"invoice" },
  { name:"Sanitary Certificate", ref:"CONS-2026-ROT-0042", date:"Mar 7, 2026", type:"cert" },
  { name:"Signed Contract", ref:"CONS-2026-ROT-0042", date:"Mar 8, 2026", type:"signed" },
  { name:"Signed Contract", ref:"CONS-2026-ROT-0038", date:"Feb 7, 2026", type:"signed" },
];

export const notifications = [
  { title:"New consolidation available", body:"Vannamei Shrimp to Rotterdam - 8 days left to join.", time:"2 hours ago", read:false },
  { title:"Documents ready", body:"B/L and invoice for CONS-2026-ROT-0042 are available.", time:"Yesterday", read:false },
  { title:"Shipment departed", body:"CONS-2026-ROT-0042 departed Guayaquil on Mar 10.", time:"Mar 10", read:true },
];

export const consolidations = [
  { id:"CONS-2026-ROT-0042", product:"Vannamei Shrimp", port:"Rotterdam", price:"$4.20/kg", departure:"Apr 15", daysLeft:8, slots:14, total:22, status:"open" },
  { id:"CONS-2026-ROT-0043", product:"Dragon Fruit", port:"Rotterdam", price:"$1.80/kg", departure:"Apr 10", daysLeft:3, slots:20, total:22, status:"closing" },
  { id:"CONS-2026-HAM-0011", product:"Vannamei Shrimp", port:"Hamburg", price:"$4.20/kg", departure:"Apr 8", daysLeft:0, slots:22, total:22, status:"full" },
];

export const orders = [
  { id:"CONS-2026-ROT-0042", product:"Vannamei Shrimp", port:"Rotterdam", tons:2, value:"$8,400", status:"transit", date:"Mar 10", eta:"Apr 2", signed:"Mar 8" },
  { id:"CONS-2026-ROT-0038", product:"Cacao", port:"Rotterdam", tons:1, value:"$3,100", status:"delivered", date:"Feb 10", eta:null, signed:"Feb 7" },
];