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
    const [selectedToppings, setSelectedToppings] = useState({});
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
        setSelectedToppings({});

        if (menuStatus === MENU_STATUS.error) {
            setMenuStatus(MENU_STATUS.idle);
        }
    };

    const adjustToppingQuantity = (topping, delta) => {
        setSelectedToppings((currentToppings) => {
            const nextQuantity = Math.max(0, (currentToppings[topping] ?? 0) + delta);

            if (nextQuantity === 0) {
                const remainingToppings = {...currentToppings};
                delete remainingToppings[topping];

                return remainingToppings;
            }

            return {
                ...currentToppings,
                [topping]: nextQuantity,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedOrder = orderInput.trim();
        const baseOrderName = trimmedOrder || selectedDrink;
        const nextOrderName = useManualInput ? trimmedOrder : formatOrderSelection(baseOrderName, selectedToppings);

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

    const trimmedOrder = orderInput.trim();
    const baseOrderName = trimmedOrder || selectedDrink;
    const selectedToppingEntries = Object.entries(selectedToppings).filter(([, quantity]) => quantity > 0);
    const totalToppingCount = selectedToppingEntries.reduce((total, [, quantity]) => total + quantity, 0);
    const orderPreview = useManualInput
        ? trimmedOrder || 'Type the full drink order'
        : baseOrderName
          ? formatOrderSelection(baseOrderName, selectedToppings)
          : 'Pick a drink or type a custom order';
    const canSubmit =
        Boolean(selectedUser) &&
        Boolean(baseOrderName) &&
        menuStatus !== MENU_STATUS.loading;

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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
                    <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-2xl">
                        <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 px-6 py-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                                        Tuesday Boba Run
                                    </p>
                                    <h2 className="mt-2 text-2xl font-bold text-slate-900">Build your order</h2>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Pick a menu drink, customise it, or type your own if it&apos;s missing.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="min-h-10 min-w-10 rounded-full border border-slate-200 bg-white text-lg text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-800"
                                    aria-label="Close order modal"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <form
                            className="grid max-h-[calc(90vh-121px)] gap-6 overflow-y-auto bg-slate-50 p-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]"
                            onSubmit={handleSubmit}
                        >
                            <div className="space-y-6">
                                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="mb-4">
                                        <p className="text-sm font-semibold text-slate-900">1. Who is this for?</p>
                                        <p className="text-sm text-slate-500">Choose the player so the order lands on the right row.</p>
                                    </div>
                                    <label className="block text-sm font-medium text-slate-700" htmlFor="user">
                                        Player
                                    </label>
                                    <select
                                        name="user"
                                        id="user"
                                        className="mt-2 min-h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
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
                                </section>

                                {menuStatus === MENU_STATUS.ready ? (
                                    <>
                                        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <div className="mb-4">
                                                <p className="text-sm font-semibold text-slate-900">2. Pick the drink</p>
                                                <p className="text-sm text-slate-500">
                                                    Use the menu dropdown for the common orders, or override it with a custom drink.
                                                </p>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700" htmlFor="drink">
                                                        Bobaboba menu
                                                    </label>
                                                    <select
                                                        name="drink"
                                                        id="drink"
                                                        className="mt-2 min-h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
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
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700" htmlFor="custom-order">
                                                        Or type a custom order
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="custom-order"
                                                        id="custom-order"
                                                        placeholder="Anything not on the menu dropdown"
                                                        className="mt-2 min-h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white"
                                                        value={orderInput}
                                                        onChange={(e) => setOrderInput(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <p className="mt-3 text-sm text-slate-500">
                                                If both fields are filled, the custom order is what gets submitted.
                                            </p>
                                        </section>

                                        {menuOptions.toppings.length > 0 && (
                                            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">3. Add toppings</p>
                                                        <p className="text-sm text-slate-500">
                                                            Use the plus and minus buttons to handle duplicates like two strawberry pops.
                                                        </p>
                                                    </div>
                                                    <div className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                                                        {totalToppingCount} topping{totalToppingCount === 1 ? '' : 's'}
                                                    </div>
                                                </div>
                                                <div className="grid max-h-80 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                                                    {menuOptions.toppings.map((topping) => {
                                                        const quantity = selectedToppings[topping] ?? 0;

                                                        return (
                                                            <div
                                                                key={topping}
                                                                className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition ${
                                                                    quantity
                                                                        ? 'border-amber-300 bg-amber-50'
                                                                        : 'border-slate-200 bg-slate-50'
                                                                }`}
                                                            >
                                                                <div className="min-w-0">
                                                                    <p className="truncate font-medium text-slate-900">{topping}</p>
                                                                    <p className="text-sm text-slate-500">
                                                                        {quantity ? `${quantity} selected` : 'Not added'}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => adjustToppingQuantity(topping, -1)}
                                                                        disabled={!quantity}
                                                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                                                                        aria-label={`Decrease ${topping}`}
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span className="w-6 text-center text-sm font-semibold text-slate-900">
                                                                        {quantity}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => adjustToppingQuantity(topping, 1)}
                                                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-300 bg-white text-lg text-amber-700 transition hover:border-amber-400 hover:bg-amber-50"
                                                                        aria-label={`Increase ${topping}`}
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </section>
                                        )}
                                    </>
                                ) : menuStatus === MENU_STATUS.error ? (
                                    <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                                        <div className="mb-4">
                                            <p className="text-sm font-semibold text-amber-900">Menu unavailable</p>
                                            <p className="text-sm text-amber-700">
                                                Bobaboba couldn&apos;t be loaded right now, so type the full order manually.
                                            </p>
                                        </div>
                                        <label className="block text-sm font-medium text-amber-900" htmlFor="order">
                                            Full drink order
                                        </label>
                                        <input
                                            type="text"
                                            name="order"
                                            id="order"
                                            placeholder="Example: Brown sugar milk tea + 2x strawberry pops"
                                            className="mt-2 min-h-11 w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400"
                                            value={orderInput}
                                            onChange={(e) => setOrderInput(e.target.value)}
                                        />
                                    </section>
                                ) : (
                                    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <p className="text-sm font-semibold text-slate-900">Loading Bobaboba menu</p>
                                        <p className="mt-2 text-sm text-slate-500">
                                            Pulling the drink and topping options now.
                                        </p>
                                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                                            <div className="h-full w-1/3 animate-pulse rounded-full bg-amber-300" />
                                        </div>
                                    </section>
                                )}
                            </div>

                            <aside className="space-y-4 lg:sticky lg:top-0">
                                <section className="rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm">
                                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                                        Order summary
                                    </p>
                                    <div className="mt-5 space-y-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Player</p>
                                            <p className="mt-1 text-lg font-semibold">
                                                {selectedUser || 'No player selected yet'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Drink</p>
                                            <p className="mt-1 text-lg font-semibold">
                                                {baseOrderName || 'No drink selected yet'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Final order</p>
                                            <p className="mt-1 rounded-2xl bg-white/10 px-4 py-3 text-sm leading-6 text-slate-100">
                                                {orderPreview}
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {selectedToppingEntries.length > 0 && !useManualInput && (
                                    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <p className="text-sm font-semibold text-slate-900">Selected toppings</p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {selectedToppingEntries.map(([topping, quantity]) => (
                                                <span
                                                    key={topping}
                                                    className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800"
                                                >
                                                    {quantity > 1 ? `${quantity}x ` : ''}
                                                    {topping}
                                                </span>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                <div className="flex flex-col gap-3">
                                    <button
                                        type="submit"
                                        disabled={!canSubmit}
                                        className="min-h-12 cursor-pointer rounded-2xl bg-emerald-500 px-4 py-3 text-base font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-200"
                                    >
                                        Submit order
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="min-h-12 cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </aside>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderModal;
