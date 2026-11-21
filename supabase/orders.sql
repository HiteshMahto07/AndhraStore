-- Andhra Store — orders table
-- Run once in Supabase → SQL Editor → New query → Run.

create table if not exists public.orders (
  id                   text primary key,          -- Razorpay order id (order_…) or COD-…
  created_at           timestamptz not null default now(),
  payment_method       text not null check (payment_method in ('razorpay', 'cod')),
  payment_status       text not null check (payment_status in ('pending', 'paid', 'cod')),
  razorpay_payment_id  text,
  paid_at              timestamptz,

  customer_name        text not null,
  phone                text not null,
  email                text,
  address1             text not null,
  address2             text,
  city                 text not null,
  state                text not null,
  pincode              text not null,

  items                jsonb not null,             -- [{ type, name, weight, weightLabel, packaging, qty, unitPrice, lineTotal }]
  subtotal             integer not null,           -- all amounts in ₹
  delivery             integer not null,
  cod_charge           integer not null default 0,
  total                integer not null,

  source               text,                       -- last-touch attribution (utm_source etc.)
  medium               text,
  campaign             text
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- Row Level Security ON with no policies: the public anon key can't read or
-- write anything. Only the server (service_role / secret key) can.
alter table public.orders enable row level security;
