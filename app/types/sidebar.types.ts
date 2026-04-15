export type SidebarItemType = {
  type: "item";
  label: string;
  icon: string;
  route: string;
  active?: boolean;
};

export type SidebarAccordionType = {
  type: "accordion";
  label: string;
  icon: string;
  children: {
    label: string;
    route: string;
  }[];
};

export type SidebarSectionType = {
  title: string;
  items: (SidebarItemType | SidebarAccordionType)[];
};
