import { useLocation, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
export function usePathname() { return useLocation().pathname; }
export function useRouter() {
 const navigate = useNavigate();
 return useMemo(() => ({ replace: (path: string) => void navigate({ to: path, replace: true }) }), [navigate]);
}
