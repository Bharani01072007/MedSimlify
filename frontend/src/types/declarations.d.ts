/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    type Element = any;
    type ElementClass = any;
    type ElementAttributesProperty = any;
    type ElementChildrenAttribute = any;
    type IntrinsicAttributes = any;
    type IntrinsicClassAttributes<T> = any;
  }

  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        [elemName: string]: any;
      }
      type Element = any;
    }
    type ReactNode = any;
    type ReactElement = any;
    type ComponentType<P = any> = any;
    type ElementRef<T = any> = any;
    type ComponentPropsWithoutRef<T = any> = any;
    type ComponentProps<T = any> = any;
    type HTMLAttributes<T = any> = any;
    type ButtonHTMLAttributes<T = any> = any;
    type InputHTMLAttributes<T = any> = any;
    type TextareaHTMLAttributes<T = any> = any;
    type FormHTMLAttributes<T = any> = any;
    type ThHTMLAttributes<T = any> = any;
    type TdHTMLAttributes<T = any> = any;
    type AnchorHTMLAttributes<T = any> = any;
    type SelectHTMLAttributes<T = any> = any;
    type OptionHTMLAttributes<T = any> = any;
    type SVGProps<T = any> = any;
    type FormEvent<T = any> = any;
    type MouseEvent<T = any> = any;
    type ChangeEvent<T = any> = any;
    type KeyboardEvent<T = any> = any;
    type FocusEvent<T = any> = any;
    type TouchEvent<T = any> = any;
    type SetStateAction<S> = S | ((prevState: S) => S);
    type Dispatch<A> = (value: A) => void;
  }
}

declare module "react/jsx-runtime" {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
  export namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    type Element = any;
  }
}

declare module "react/jsx-dev-runtime" {
  export const jsxDEV: any;
  export const Fragment: any;
  export namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    type Element = any;
  }
}

declare module "react" {
  export namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    type Element = any;
  }

  export type ReactNode = any;
  export type ReactElement = any;
  export type ComponentType<P = any> = any;
  export type ElementRef<T = any> = any;
  export type ComponentPropsWithoutRef<T = any> = any;
  export type ComponentProps<T = any> = any;
  export type HTMLAttributes<T = any> = any;
  export type ButtonHTMLAttributes<T = any> = any;
  export type InputHTMLAttributes<T = any> = any;
  export type TextareaHTMLAttributes<T = any> = any;
  export type FormHTMLAttributes<T = any> = any;
  export type ThHTMLAttributes<T = any> = any;
  export type TdHTMLAttributes<T = any> = any;
  export type AnchorHTMLAttributes<T = any> = any;
  export type SelectHTMLAttributes<T = any> = any;
  export type OptionHTMLAttributes<T = any> = any;
  export type SVGProps<T = any> = any;
  export type FormEvent<T = any> = any;
  export type MouseEvent<T = any> = any;
  export type ChangeEvent<T = any> = any;
  export type KeyboardEvent<T = any> = any;
  export type FocusEvent<T = any> = any;
  export type TouchEvent<T = any> = any;
  export type SetStateAction<S> = S | ((prevState: S) => S);
  export type Dispatch<A> = (value: A) => void;

  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useRef<T>(initialValue?: T): { current: T };
  export function useContext<T>(context: any): T;
  export function useId(): string;
  export function useTransition(): [boolean, (callback: () => void) => void];

  export function forwardRef<T, P = any>(render: (props: P, ref: any) => any): ComponentType<P> & { displayName?: string };
  export function createContext<T>(defaultValue: T): any;
  export function memo<T>(component: T): T;
}

declare module "react-dom" {
  export const render: any;
  export const createRoot: any;
  export const hydrateRoot: any;
}

declare module "react-dom/client" {
  export const createRoot: any;
  export const hydrateRoot: any;
}

declare module "react-native" {
  export const View: any;
  export const Text: any;
  export const ScrollView: any;
  export const TouchableOpacity: any;
  export const StyleSheet: any;
  export const Image: any;
  export const TextInput: any;
  export const Alert: any;
  export const ActivityIndicator: any;
  const content: any;
  export default content;
}

declare module "@react-navigation/native" {
  export const NavigationContainer: any;
  export const useNavigation: any;
  export const useRoute: any;
  const content: any;
  export default content;
}

declare module "@react-navigation/native-stack" {
  export function createNativeStackNavigator(): any;
  const content: any;
  export default content;
}

declare module "@react-navigation/bottom-tabs" {
  export function createBottomTabNavigator(): any;
  const content: any;
  export default content;
}

declare module "react-redux" {
  export function useSelector(...args: any[]): any;
  export function useDispatch(...args: any[]): any;
  export const Provider: any;
  const content: any;
  export default content;
}

declare module "@tanstack/react-router" {
  export const createFileRoute: any;
  export const createRootRouteWithContext: any;
  export const Link: any;
  export const Outlet: any;
  export const useNavigate: any;
  export const useRouter: any;
  export const HeadContent: any;
  export const Scripts: any;
}

declare module "@tanstack/react-query" {
  export const QueryClient: any;
  export const QueryClientProvider: any;
  export const useQuery: any;
  export const useMutation: any;
}

declare module "@tanstack/react-start" {
  export const createStart: any;
  export const createCsrfMiddleware: any;
  export const createMiddleware: any;
}



declare module "recharts" {
  export const Bar: any;
  export const BarChart: any;
  export const CartesianGrid: any;
  export const Line: any;
  export const LineChart: any;
  export const ReferenceLine: any;
  export const ResponsiveContainer: any;
  export const Tooltip: any;
  export const XAxis: any;
  export const YAxis: any;
}

declare module "sonner" {
  export const toast: any;
  export const Toaster: any;
}

declare module "@radix-ui/react-accordion" { export const Root: any; export const Item: any; export const Header: any; export const Trigger: any; export const Content: any; }
declare module "@radix-ui/react-alert-dialog" { export const Root: any; export const Trigger: any; export const Content: any; export const Header: any; export const Footer: any; export const Title: any; export const Description: any; export const Action: any; export const Cancel: any; }
declare module "@radix-ui/react-aspect-ratio" { export const Root: any; }
declare module "@radix-ui/react-avatar" { export const Root: any; export const Image: any; export const Fallback: any; }
declare module "@radix-ui/react-checkbox" { export const Root: any; export const Indicator: any; }
declare module "@radix-ui/react-collapsible" { export const Root: any; export const Trigger: any; export const Content: any; }
declare module "@radix-ui/react-context-menu" { export const Root: any; export const Trigger: any; export const Content: any; export const Item: any; }
declare module "@radix-ui/react-dialog" { export const Root: any; export const Trigger: any; export const Portal: any; export const Overlay: any; export const Content: any; export const Header: any; export const Footer: any; export const Title: any; export const Description: any; export const Close: any; }
declare module "@radix-ui/react-dropdown-menu" { export const Root: any; export const Trigger: any; export const Content: any; export const Item: any; }
declare module "@radix-ui/react-hover-card" { export const Root: any; export const Trigger: any; export const Content: any; }
declare module "@radix-ui/react-label" { export const Root: any; }
declare module "@radix-ui/react-menubar" { export const Root: any; export const Menu: any; export const Trigger: any; export const Content: any; export const Item: any; }
declare module "@radix-ui/react-navigation-menu" { export const Root: any; export const List: any; export const Item: any; export const Trigger: any; export const Content: any; export const Link: any; }
declare module "@radix-ui/react-popover" { export const Root: any; export const Trigger: any; export const Content: any; }
declare module "@radix-ui/react-progress" { export const Root: any; export const Indicator: any; }
declare module "@radix-ui/react-radio-group" { export const Root: any; export const Item: any; export const Indicator: any; }
declare module "@radix-ui/react-scroll-area" { export const Root: any; export const Viewport: any; export const Scrollbar: any; export const Thumb: any; }
declare module "@radix-ui/react-select" { export const Root: any; export const Group: any; export const Value: any; export const Trigger: any; export const Content: any; export const Label: any; export const Item: any; export const ItemText: any; export const ItemIndicator: any; export const ScrollUpButton: any; export const ScrollDownButton: any; export const Viewport: any; export const Separator: any; }
declare module "@radix-ui/react-separator" { export const Root: any; }
declare module "@radix-ui/react-slider" { export const Root: any; export const Track: any; export const Range: any; export const Thumb: any; }
declare module "@radix-ui/react-slot" { export const Slot: any; export const Slottable: any; }
declare module "@radix-ui/react-switch" { export const Root: any; export const Thumb: any; }
declare module "@radix-ui/react-tabs" { export const Root: any; export const List: any; export const Trigger: any; export const Content: any; }
declare module "@radix-ui/react-toggle" { export const Root: any; }
declare module "@radix-ui/react-toggle-group" { export const Root: any; export const Item: any; }
declare module "@radix-ui/react-tooltip" { export const Provider: any; export const Root: any; export const Trigger: any; export const Content: any; }

declare module "class-variance-authority" {
  export function cva(...args: any[]): any;
  export type VariantProps<T> = any;
}

declare module "clsx" {
  export type ClassValue = any;
  export function clsx(...args: any[]): string;
}

declare module "tailwind-merge" {
  export function twMerge(...args: any[]): string;
}
