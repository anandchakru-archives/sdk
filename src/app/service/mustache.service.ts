import Mustache from "mustache";
type MustacheWaxType = typeof Mustache;
export interface MustacheWaxStatic extends MustacheWaxType { Formatters: any; }
declare var MustacheWax: MustacheWaxStatic;
