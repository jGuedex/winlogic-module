import {AggregateField} from "firebase-admin/firestore";
import fb from "../conf/FirebaseAdmin";
import {TCosts} from "../type/TCosts";

export class SystemService {
  async getTotalCosts(): Promise<TCosts | Error> {
    try {
      const coll = fb.firestore().collection("token");
      const sumAggregateQuery = coll.aggregate(
        {totalCost: AggregateField.sum("total_cost")}
      );
      const countSnapshot = await coll.count().get();
      const totalRequests = countSnapshot.data().count;

      const snapshot = await sumAggregateQuery.get();
      const snapshotData = snapshot.data();
      const totalDollarCost = snapshotData.totalCost;
      const totalRealCost = totalDollarCost * 5.2; // Conversão de dollar para real (como é apenas POC, então será hard-coded)
      const costs: TCosts = {
        dollar: `${totalDollarCost.toLocaleString("en-us", {style: "currency", currency: "USD", maximumFractionDigits: 5})}`,
        real: `${totalRealCost.toLocaleString("pt-br", {style: "currency", currency: "BRL", maximumFractionDigits: 5})}`,
        total_requests: totalRequests,
      };

      return costs;
    } catch (err) {
      return Error(err instanceof Error ? err.message : "Erro desconhecido");
    }
  }
}
