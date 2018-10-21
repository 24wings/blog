

tree
```typescript
import { Menu } from '../entity/rbac/Menu';

export abstract class AbstractTree<T> {
    abstract getId(): number;
    abstract getParentId(): number;
    children: AbstractTree<T>[];

}


export class MenuTree extends Menu implements AbstractTree<Menu> {
    getId() {
        return this.menuId;
    }
    getParentId() {
        return this.parentId;
    }
    children: AbstractTree<Menu>[] = [];

}
export function listToTree<T>(list: AbstractTree<T>[]): AbstractTree<T>[] {
    let treeMenus: AbstractTree<T>[] = [];
    /** 扫出顶级菜单,若存在下级菜单递归扫下级菜单 */
    if (list.some(menu => menu.getParentId() == 0 || !menu.getParentId())) {
        treeMenus = list.filter(menu => menu.getParentId() == 0 || !menu.getParentId());
        for (let menu of treeMenus) {
            menu.children = getChildren<T>(menu, list);
        }

    }
    return treeMenus;
}
export function getChildren<T>(topItem: AbstractTree<T>, options: AbstractTree<T>[]): AbstractTree<T>[] {
    let children = options.filter(menu => menu.getParentId() == topItem.getId());
    for (let submenu of children) {
        submenu.children = getChildren<T>(submenu, options);
    }
    return children;
}
let menus: Menu[] = [{ menuId: 1, parentId: 0, text: "顶级菜单" },
{ menuId: 2, parentId: 1, text: "A组菜单" },
{ menuId: 3, parentId: 2, text: "A组a菜单" },
] as any;

let tree = listToTree<AbstractTree<Menu>>(menus.map(menu => Object.assign(new MenuTree(), menu)));
console.log(tree);

console.log(JSON.stringify(tree));
```