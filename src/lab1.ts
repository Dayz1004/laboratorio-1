/**
 * =============================
 *  PREGUNTA 1
 * =============================
 */

/**
 * a) Que TS sea de tipo estático significa que existen reglas de tipos para detectar errores antes de
 *    ejecutar el programa. Esto tiene la ventaja de que los errores se encuentran en tiempo de compilación,
 *    y el código es más fácil de leer y entender, pues se deben especificar los tipos de cada variable.
 *
 * b) El tipo any desactiva completamente el sistema de tipos de TypeScript - puedes hacer 
 *    cualquier operación sin verificación. El tipo unknown es un "top type" seguro que 
 *    representa cualquier valor, pero requiere verificación antes de usar. En el ejemplo:
 *    - Con any: compila sin errores, pero falla en runtime con printData(42)
 *    - Con unknown: error de compilación porque no puedes usar .toUpperCase() directamente
 */



/**
 * =============================
 *  PREGUNTA 2
 * =============================
 */

const data = require('../bakemons.json') as Bakemon[]

interface Bakemon {
  id: number,
  name: string,
  type: string,
  secondary_type?: string,
  stats: {
    hp: number,
    atk: number,
    def: number,
    sp_atk: number,
    sp_def: number,
    speed: number
  },
  moves: {name: string, type: string, power: number}[]
};

/**
 * =============================
 *  PREGUNTA 3
 * =============================
 */

function filterByType(bakemons: Bakemon[], type: unknown): unknown {
  const filtered: Bakemon[] = bakemons.filter(function(bakemon) {
    return bakemon.type === type || bakemon.secondary_type === type
  });
  return filtered;
}

/**
 * =============================
 *  PREGUNTA 4
 * =============================
 */

/**
 * La función retorna (Bakemon & {bst: number})[], que es un array de objetos que combinan
 * todas las propiedades de Bakemon más la propiedad bst (Base Stat Total).
 * Se eligió intersección de tipos porque permite mantener la estructura original
 * de Bakemon y añadir exactamente lo que necesitamos sin crear interfaces adicionales.
 */

function addBST(bakemons: Bakemon[]): (Bakemon & {bst: number}) [] {
  return bakemons.map(function(bakemon) {
    const bst = bakemon.stats.hp + bakemon.stats.atk + bakemon.stats.def 
    + bakemon.stats.sp_atk + bakemon.stats.sp_def + bakemon.stats.speed
    return {...bakemon, bst: bst};
  });
}

/**
 * =============================
 *  PREGUNTA 5
 * =============================
 */

/**
 * La función retorna Record<string, (Bakemon & {bst: number})>, que es un objeto
 * donde cada llave es un tipo de Bakemon (string) y el valor es el Bakemon más
 * fuerte de ese tipo. Se eligió Record porque permite claves dinámicas (los tipos
 * que aparezcan en los datos) y valores de tipo específico.
 */

function findStrongestByType(bakemons: Bakemon[]): Record<string, (Bakemon & {bst: number})> {
    const bakemonBst = addBST(bakemons);
    const result: Record<string, (Bakemon & {bst: number})> = {};
    
    bakemonBst.forEach(function(bakemon) {
        // Procesar tipo primario
        if (!result[bakemon.type] || bakemon.bst > result[bakemon.type].bst) {
            result[bakemon.type] = bakemon;
        }
        
        // Procesar tipo secundario (si existe)
        if (bakemon.secondary_type) {
            if (!result[bakemon.secondary_type] || bakemon.bst > result[bakemon.secondary_type].bst) {
                result[bakemon.secondary_type] = bakemon;
            }
        }
    });
    
    return result;
}
