// Librarys 
import { Link } from "react-router";

// Imports 
import user2 from "../../assets/images/profile/user-2.jpg";
import user3 from "../../assets/images/profile/user-3.jpg";
import img1 from "../../assets/images/blog/blog-img1.jpg";
import img2 from "../../assets/images/blog/blog-img2.jpg";
import img3 from "../../assets/images/blog/blog-img3.jpg";

// Import styles
import styles from "../../css/dashboard/BlogCards.module.css";

const BlogCardsData = [
  {
    avatar: user2,
    coveravatar: img1,
    read: "2 min Read",
    title: "As yen tumbles, gadget-loving Japan goes for secondhand iPhones",
    category: "Social",
    name: "Georgeanna Ramero",
    view: "9,125",
    comments: "3",
    time: "Mon, Dec 19",
    url: ""
  },
  {
    avatar: user2,
    coveravatar: img2,
    read: "2 min Read",
    title: "Intel loses bid to revive antitrust case against patent foe Fortress",
    category: "Gadget",
    name: "Georgeanna Ramero",
    view: "4,150",
    comments: "38",
    time: "Sun, Dec 18",
    url: ""
  },
  {
    avatar: user3,
    coveravatar: img3,
    read: "2 min Read",
    title: "COVID outbreak deepens as more lockdowns loom in China",
    category: "Health",
    name: "Georgeanna Ramero",
    view: "9,480",
    comments: "12",
    time: "Sat, Dec 17",
    url: ""
  },
];

// Component 
const BlogCards = () => {
  return (
    <>
      <div className={styles.grid}>
        {BlogCardsData.map((item, i) => (
          <div className={styles.cardCol} key={i}>
            <Link to={item.url} className="group">
              <div className={styles.card}>
                <div className={styles.coverWrapper}>
                  <img src={item.coveravatar} alt="matdash" className={styles.coverImg} />
                  <span className={styles.readBadge}>
                    {item.read}
                  </span>
                </div>
                <div className={styles.content}>
                  <img
                    src={item.avatar}
                    className={styles.avatar}
                    alt="user"
                  />
                  <span className={styles.categoryBadge}>
                    {item.category}
                  </span>
                  <h5 className={styles.title}>{item.title}</h5>
                  <div className={styles.flexRow}>
                    <div className={styles.flexGap}>
                      <span className={styles.textSm}>{item.view}</span>
                    </div>
                    <div className={styles.flexGap2}>
                      <span className={styles.textSm}>{item.view}</span>
                    </div>
                    <div className={styles.flexEnd}>
                      <span className={styles.textSm}>{item.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default BlogCards;