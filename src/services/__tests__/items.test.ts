import {
    findMovedItemIndexes,
    getInsertedItemDecimalPosition,
    isEqualDespiteOrder,
} from '../items';
import { Decimal } from '@prisma/client/runtime';

describe('test items service', () => {
    describe('test isEqualDespiteOrder', () => {
        test('should return true when arrays are equal', () => {
            const arr1 = ['a', 'b', 'c'];
            const arr2 = ['b', 'c', 'a'];

            const result = isEqualDespiteOrder(arr1, arr2);

            expect(result).toBe(true);
        });

        test('should return false when arrays are not equal', () => {
            const arr1 = ['a', 'b', 'c'];
            const arr2 = ['b', 'c', 'd'];

            const result = isEqualDespiteOrder(arr1, arr2);

            expect(result).toBe(false);
        });

        test('should return false when arrays have different length', () => {
            const arr1 = ['a', 'b', 'c'];
            const arr2 = ['b', 'c'];

            const result = isEqualDespiteOrder(arr1, arr2);

            expect(result).toBe(false);
        });
    });

    describe('test findMovedItemFromToIndexes', () => {
        test('should return correct indexes when arrays have 2 elements each', () => {
            const prevItems = [{ id: 'a' }, { id: 'b' }];
            const newItems = [{ id: 'b' }, { id: 'a' }];

            const result = findMovedItemIndexes(prevItems, newItems);

            expect(result).toEqual([1, 0]);
        });

        test('should return correct indexes when arrays have 3 elements each', () => {
            const prevItems = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
            const newItems = [{ id: 'b' }, { id: 'a' }, { id: 'c' }];

            const result = findMovedItemIndexes(prevItems, newItems);

            expect(result).toEqual([1, 0]);
        });

        test('should return correct indexes when arrays have 4 elements each', () => {
            const prevItems = [
                { id: 'a' },
                { id: 'b' },
                { id: 'c' },
                { id: 'd' },
            ];
            const newItems = [
                { id: 'b' },
                { id: 'c' },
                { id: 'a' },
                { id: 'd' },
            ];

            const result = findMovedItemIndexes(prevItems, newItems);

            expect(result).toEqual([0, 2]);
        });

        test(
            'should return correct indexes when item is moved to the beginning' +
                'and arrays have 3 elements each',
            () => {
                const prevItems = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
                const newItems = [{ id: 'c' }, { id: 'a' }, { id: 'b' }];

                const result = findMovedItemIndexes(prevItems, newItems);

                expect(result).toEqual([2, 0]);
            }
        );

        test(
            'should return correct indexes when item is moved to the beginning' +
                'and arrays have 4 elements each',
            () => {
                const prevItems = [
                    { id: 'a' },
                    { id: 'b' },
                    { id: 'c' },
                    { id: 'd' },
                ];
                const newItems = [
                    { id: 'c' },
                    { id: 'a' },
                    { id: 'b' },
                    { id: 'd' },
                ];

                const result = findMovedItemIndexes(prevItems, newItems);

                expect(result).toEqual([2, 0]);
            }
        );

        test(
            'should return correct indexes when item is moved to the end' +
                'and arrays have 3 elements each',
            () => {
                const prevItems = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
                const newItems = [{ id: 'a' }, { id: 'c' }, { id: 'b' }];

                const result = findMovedItemIndexes(prevItems, newItems);

                expect(result).toEqual([2, 1]);
            }
        );

        test(
            'should return correct indexes when item is moved to the end' +
                'and arrays have 4 elements each',
            () => {
                const prevItems = [
                    { id: 'a' },
                    { id: 'b' },
                    { id: 'c' },
                    { id: 'd' },
                ];
                const newItems = [
                    { id: 'a' },
                    { id: 'c' },
                    { id: 'd' },
                    { id: 'b' },
                ];

                const result = findMovedItemIndexes(prevItems, newItems);

                expect(result).toEqual([1, 3]);
            }
        );
    });

    describe('test getMovedItemDecimalPosition', () => {
        const items = [
            { position: new Decimal(1) },
            { position: new Decimal(2) },
            { position: new Decimal(3) },
            { position: new Decimal(4) },
        ];

        test('should return correct position', () => {
            const result = getInsertedItemDecimalPosition(items, 1);

            expect(result.valueOf()).toBe(new Decimal(1.5).valueOf());
        });

        test('should return correct position when item is moved to the beginning', () => {
            const result = getInsertedItemDecimalPosition(items, 0);

            expect(result.valueOf()).toBe(new Decimal(0.5).valueOf());
        });

        test('should return correct position when item is moved to the end', () => {
            const result = getInsertedItemDecimalPosition(items, 4);

            expect(result.valueOf()).toBe(new Decimal(5).valueOf());
        });
    });
});
