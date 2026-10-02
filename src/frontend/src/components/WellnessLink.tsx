import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
export function WellnessLink({ href, children, ...props }: { href: string; children?: ReactNode; className?: string; "aria-current"?: "page"; }) {
 if (href.startsWith("/groups/")) return <Link to="/groups/$topic" params={{ topic: href.split("/")[2] }} {...props}>{children}</Link>;
 return <Link to={href} {...props}>{children}</Link>;
}
