import styles from './index.module.less';

function Reminder(){

    const list = [
        {
            id: 'zhichangzhuli',
            icon: 'https://www.imageoss.com/images/2023/04/23/Frame2x11dd9e54d8caafc4b2.png',
            name: 'Workplace assistant',
            desc: 'As a product manager of the landlord game of the mobile phone, how to make a domestic explosion?'
        },
        {
            id: 'dianyingjiaoben',
            icon: 'https://www.imageoss.com/images/2023/04/23/Frame2x12ff8d52b031b85fbe.png',
            name: 'Movie script',
            desc: 'Write a movie script and tell a story of a North drifting grass root entrepreneurship counterattack'
        },
        {
            id: 'cuanxieduanwen',
            icon: 'https://www.imageoss.com/images/2023/04/23/Frame2x132f6276a56cf44e81.png',
            name: 'Writing short essay',
            desc: 'Write a short article to explain the meaning of happiness in the story'
        },{
            id: 'daimabianxie',
            icon: 'https://www.imageoss.com/images/2023/04/23/Frame2x14a0f6c48d4355c6ea.png',
            name: 'Code writing',
            desc: 'Use JavaScript to write a function to get random numbers'
        }
    ]

    return (
<div className={styles.reminder}>
        <h2 className={styles.reminder_title}><img src="https://www.imageoss.com/images/2023/04/23/robot-logo4987eb2ca3f5ec85.png" alt="" />Welcome to {import.meta.env.VITE_APP_TITLE}</h2>
        <p className={styles.reminder_message}>Chat with AI intelligence, imagine infinite possibilities!Based on advanced AI engines, make your communication more intelligent, efficient and convenient!</p>
        <p className={styles.reminder_message}><span>Shift</span> + <span>Enter</span> Change. Start input<span>/</span> Summon Prompt character preset.</p>
        <div className={styles.reminder_question}>
            {
                list.map((item)=>{
                    return (
<div key={item.id} className={styles.reminder_question_item}>
                        <img src={item.icon} alt="" />
                        <h3>{item.name}</h3>
                        <p>{item.desc}</p>
</div>
)
                })
            }

        </div>
</div>
);
}

export default Reminder;
