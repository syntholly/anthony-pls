'use client';

import {useData} from '@/providers/DataProvider';
import {formatOrderSelection, isRecentOrder} from '@/utils/orderRules';
import React, {useEffect, useState} from 'react';

const MENU_STATUS = {
    idle: 'idle',
    loading: 'loading',
    ready: 'ready',
    error: 'error',
};

const OrderModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [orderInput, setOrderInput] = useState('');
    const [selectedDrink, setSelectedDrink] = useState('');
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [menuOptions, setMenuOptions] = useState({drinks: [], toppings: []});
    const [menuStatus, setMenuStatus] = useState(MENU_STATUS.idle);
    const {data, updateUser} = useData();
    const isOrderWindowOpen = new Date().getDay() === 2;
    const useManualInput = menuStatus === MENU_STATUS.error;

    useEffect(() => {
        if (!isOpen || menuStatus === MENU_STATUS.ready) {
            return;
        }

        let isCancelled = false;

        const loadMenuOptions = async () => {
            setMenuStatus(MENU_STATUS.loading);

            try {
                const response = await fetch('/api/menu-options');

                if (!response.ok) {
                    throw new Error(`Menu request failed: ${response.status}`);
                }

                const menu = await response.json();

                if (isCancelled) {
                    return;
                }

                setMenuOptions({
                    drinks: menu.drinks ?? [],
                    toppings: menu.toppings ?? [],
                });
                setMenuStatus(MENU_STATUS.ready);
            } catch {
                if (!isCancelled) {
                    setMenuStatus(MENU_STATUS.error);
                }
            }
        };

        loadMenuOptions();

        return () => {
            isCancelled = true;
        };
    }, [isOpen]);

    const resetForm = () => {
        setIsOpen(false);
        setSelectedUser('');
        setOrderInput('');
        setSelectedDrink('');
        setSelectedToppings([]);

        if (menuStatus === MENU_STATUS.error) {
            setMenuStatus(MENU_STATUS.idle);
        }
    };

    const toggleTopping = (topping) => {
        setSelectedToppings((currentToppings) => {
            if (currentToppings.includes(topping)) {
                return currentToppings.filter((item) => item !== topping);
            }

            return [...currentToppings, topping];
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedOrder = orderInput.trim();
        const formattedMenuOrder = formatOrderSelection(selectedDrink, selectedToppings);
        const nextOrderName = trimmedOrder || formattedMenuOrder;

        if (!selectedUser || !nextOrderName) {
            return;
        }

        const userToUpdate = data.find((user) => user.name === selectedUser);

        if (userToUpdate) {
            const now = Date.now();
            const shouldReplaceLatestOrder = isRecentOrder(userToUpdate.orderLatest, now);

            const updatedOrders = shouldReplaceLatestOrder
                ? [...userToUpdate.orders.slice(0, -1), {name: nextOrderName, date: now}]
                : [...userToUpdate.orders, {name: nextOrderName, date: now}];

            await updateUser({
                ...userToUpdate,
                orders: updatedOrders,
                orderLatest: now,
            });
        }

        resetForm();
    };

    return (
        <div>
            <button
                onClick={() => setIsOpen(true)}
                disabled={!isOrderWindowOpen}
                className="mt-8 cursor-pointer rounded bg-green-400 px-4 py-2 text-white transition-colors hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-green-200"
            >
                {isOrderWindowOpen ? 'Submit Order' : 'Opens Tuesday'}
            </button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="rounded-lg bg-white p-6 shadow-lg">
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <select
                                name="user"
                                id="user"
                                className="rounded border px-2 py-2"
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                            >
                                <option value="" disabled>
                                    Select a user
                                </option>
                                {data.map((user) => (
                                    <option key={user.name} value={user.name}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>

                            {menuStatus === MENU_STATUS.ready ? (
                                <>
                                    <select
                                        name="drink"
                                        id="drink"
                                        className="rounded border px-2 py-2"
                                        value={selectedDrink}
                                        onChange={(e) => setSelectedDrink(e.target.value)}
                                    >
                                        <option value="" disabled>
                                            Select a drink
                                        </option>
                                        {menuOptions.drinks.map((drink) => (
                                            <option key={drink} value={drink}>
                                                {drink}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            name="custom-order"
                                            id="custom-order"
                                            placeholder="Custom order"
                                            className="rounded border p-2"
                                            value={orderInput}
                                            onChange={(e) => setOrderInput(e.target.value)}
                                        />
                                        <p className="text-sm text-slate-600">
                                            If your drink isn&apos;t listed above, enter it here instead.
                                        </p>
                                    </div>

                                    {menuOptions.toppings.length > 0 && (
                                        <details className="rounded border p-3">
                                            <summary className="cursor-pointer font-medium">
                                                Add toppings ({selectedToppings.length})
                                            </summary>
                                            <div className="mt-3 grid max-h-48 grid-cols-2 gap-2 overflow-y-auto text-sm">
                                                {menuOptions.toppings.map((topping) => (
                                                    <label
                                                        key={topping}
                                                        className="flex items-center gap-2 rounded border px-2 py-1"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedToppings.includes(topping)}
                                                            onChange={() => toggleTopping(topping)}
                                                        />
                                                        <span>{topping}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </details>
                                    )}
                                </>
                            ) : menuStatus === MENU_STATUS.error ? (
                                <>
                                    <input
                                        type="text"
                                        name="order"
                                        id="order"
                                        placeholder="Enter order"
                                        className="rounded border p-2"
                                        value={orderInput}
                                        onChange={(e) => setOrderInput(e.target.value)}
                                    />
                                    <p className="text-sm text-amber-700">
                                        Bobaboba menu couldn&apos;t be loaded, so manual entry is available.
                                    </p>
                                </>
                            ) : (
                                <div className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                                    Loading Bobaboba menu...
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={
                                    !selectedUser ||
                                    (!orderInput.trim() && !selectedDrink) ||
                                    menuStatus === MENU_STATUS.loading
                                }
                                className="mt-4 cursor-pointer rounded bg-indigo-400 px-4 py-2 text-white transition-colors hover:bg-indigo-500"
                            >
                                Submit Order
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="cursor-pointer rounded bg-red-300 px-4 py-2 text-white transition-colors hover:bg-red-400"
                            >
                                Exit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderModal;
