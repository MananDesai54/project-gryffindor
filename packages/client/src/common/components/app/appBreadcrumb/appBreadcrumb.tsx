import { Link } from "@tanstack/react-router";
import { map } from "lodash";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../shadcn/components/ui/breadcrumb";
import { BreadcrumbItemType } from "./type";

type Props = {
  items: Array<BreadcrumbItemType>;
};

export default function AppBreadcrumb({ items }: Props) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {map(items, (item, index) => (
          <>
            <BreadcrumbItem key={item.label}>
              {item.link ? (
                <Link to={item.link}>{item.label}</Link>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
