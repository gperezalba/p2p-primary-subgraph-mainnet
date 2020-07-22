import { Deal, Offer, DealCommodity, DealPackable, OfferPackable } from "../generated/schema";
import { NewPendingDeal } from "../generated/PIBP2PPrimary/PIBP2PPrimary";
import { BigDecimal, Address, BigInt } from "@graphprotocol/graph-ts";
import { NewDeal } from "../generated/PIBP2PCommodityPrimary/PIBP2PCommodityPrimary";
import { NewDeal as NewDealPackable } from "../generated/PIBP2PPackablePrimary/PIBP2PPackablePrimary";
import { pushDealToOffer, pushDealToOfferCommodity, pushDealToOfferPackable } from "./offer";

export function createDeal(event: NewPendingDeal): void {
    let deal = Deal.load(event.params.dealId.toHexString());
    let offer = Offer.load(event.params.offerId.toHexString());

    if (deal == null) {
        deal = new Deal(event.params.dealId.toHexString());

        deal.offer = event.params.offerId.toHexString();
        deal.seller = offer.owner;
        deal.buyer = event.params.buyer.toHexString();
        deal.sellAmount = event.params.sellAmount;
        deal.buyAmount = event.params.buyAmount;
        deal.sellerVote = BigInt.fromI32(0);
        deal.buyerVote = BigInt.fromI32(0);
        deal.auditorVote = BigInt.fromI32(0);
        deal.isPending = true;
        deal.timestamp = event.block.timestamp;

        deal.save();

        pushDealToOffer(event.params.offerId.toHexString(), event.params.dealId.toHexString());
    }
}

export function createCommodityDeal(event: NewDeal): void {
    let deal = DealCommodity.load(event.params.offerId.toHexString());

    if (deal == null) {
        deal = new DealCommodity(event.params.offerId.toHexString());

        deal.offer = event.params.offerId.toHexString();
        deal.buyer = event.params.buyer.toHexString();
        deal.timestamp = event.block.timestamp;

        deal.save();

        pushDealToOfferCommodity(event.params.offerId.toHexString(), event.params.offerId.toHexString());
    }
}

export function createPackableDeal(event: NewDealPackable): void {
    let deal = DealPackable.load(event.params.offerId.toHexString());

    if (deal == null) {
        deal = new DealPackable(event.params.offerId.toHexString());

        deal.offer = event.params.offerId.toHexString();
        deal.buyer = event.params.buyer.toHexString();
        deal.sellAmount = event.params._sellAmount;
        deal.buyAmount = event.params._buyAmount;
        deal.timestamp = event.block.timestamp;

        deal.save();

        pushDealToOfferPackable(event.params.offerId.toHexString(), event.params.offerId.toHexString());
    }
}

export function finishDeal(dealId: string, success: boolean, executor: Address): void {
    let deal = Deal.load(dealId);

    if (deal != null) {
        deal.isPending = false;
        deal.isSuccess = success;
        deal.executor = executor;

        deal.save();
    }
}