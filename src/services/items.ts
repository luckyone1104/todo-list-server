import { Decimal } from '@prisma/client/runtime';

export const isEqualDespiteOrder = <T extends string>(arr1: T[], arr2: T[]) => {
    if (arr1.length !== arr2.length) {
        return false;
    }

    const sorted1 = arr1.sort();
    const sorted2 = arr2.sort();

    return sorted1.every((item, index) => item === sorted2[index]);
};

export const findMovedItemIndexes = <T extends { id: string }>(
    items: T[],
    newItems: T[]
) => {
    let idx = 0;

    while (
        items[idx].id === newItems[idx].id ||
        (items[idx].id === newItems[idx + 1]?.id && idx < items.length)
    ) {
        idx++;
    }

    const newIdx = newItems.findIndex((item) => item.id === items[idx].id);

    return [idx, newIdx];
};

export const getInsertedItemDecimalPosition = (
    items: { position: Decimal }[],
    idx: number
) => {
    if (idx === 0) {
        return items[idx].position.div(2);
    }

    if (idx === items.length) {
        return items[idx - 1].position.add(1);
    }

    return items[idx - 1].position.add(items[idx].position).div(2);
};
