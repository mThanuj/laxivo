import { Product } from "@/types/product";
import { Store } from "@/types/store";

export type StoreTemplateProps = {
    store: Store;
    products: Product[];
};

export type TemplateComponent = React.ComponentType<StoreTemplateProps>;
