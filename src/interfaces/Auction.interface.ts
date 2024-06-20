export interface AuctionInterface{
    id: number,
    user_id: number,
    title: string,
    description: string,
    startingPrice: number,
    endedAt: Date,
    image: string
}