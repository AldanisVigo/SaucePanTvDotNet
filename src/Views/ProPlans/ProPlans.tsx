import Header from "../../Components/Header/Header"
import AsideMenu from "../../Components/AsideMenu/AsideMenu"
import './ProPlans.css'
import { useNavigate } from "react-router-dom"
const ProPlans = () => {
    const navigate = useNavigate()
    const plans = [
        {
            title : "Pro Plan",
            price : 69.99,
            term : 'year',
            includes : [
                "Unlimited Uploads",
                "Pro Badge",
                "Access to Music Shows",
                "Submissions to Labels",
                "Insider's Forum"
            ]
        },
        {
            title : "Producer's Plan",
            price : 99.99,
            term : 'year',
            includes : [
                "Unlimited Uploads",
                "Pro & OG Badge",
                "Access to Music Shows",
                "Customizeable Beatstore",
                "License Maker",
                "Direct Messaging",
                "Collabs",
                "Insider's Forum"
            ]
        }
    ]
    return <div>
        <Header/>
        <div className="pro_plans_container">
            <AsideMenu/>
            <main className="pro_plans_container_main">
                <div className="back_and_title">
                    <button onClick={e=>navigate(-1)}>Back</button>
                    <h3 className="pro_plans_label">Pro Plans</h3>
                </div>
                <div className="plans_container">
                    {plans.map((plan,i)=><div key={i} className="plan">
                        <div className="plan_info">
                            <span className="plan_title">{plan.title}</span>
                            <ol className="plan_features_list">
                                {plan.includes.map((item,ix)=><li key={ix}>{item}</li>)}
                            </ol>
                        </div>
                        <div className="price_and_buy_button">
                            <span className="plan_price">${plan.price.toFixed(2)} / {plan.term}</span>
                            <button className="plan_buy_button">Buy</button>
                        </div>
                    </div>)}
                </div>
            </main>
        </div>
    </div>
}

export default ProPlans