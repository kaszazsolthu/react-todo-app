import './App.css';
import { useState, useEffect } from 'react';


function App() {

    const [boards, setBoards] = useState(
        JSON.parse(window.localStorage.getItem("dashboards")) ?? 
        [{ 
            name: 'Untitled dashboard',
            cards: []
        }]
    );
    useEffect(() => window.localStorage.setItem("dashboards", JSON.stringify(boards)));


    function newCard(boardNum) {
        // kell egy másolat a tömbről, az eredetit módosítani nem jó ötlet :(
        let tmp = boards.slice();
        tmp[boardNum].cards.push({name: 'New Card', description: '', opened: true});
        setBoards(tmp);
    }

    function newBoard() {
        let tmp = boards.slice();
        tmp.push({name: 'Untitled dashboard', cards: []});
        setBoards(tmp);
    }

    function delBoard(boardNum) {
        let tmp = boards.slice();
        tmp.splice(boardNum, 1);
        setBoards(tmp);
    }

    function delCard(boardNum, cardNum) {
        let tmp = boards.slice();
        tmp[boardNum].cards.splice(cardNum, 1);
        setBoards(tmp);  
    }

    function copyCard(boardNum, cardNum) {
        let tmp = boards.slice();
        tmp[boardNum].cards.splice(cardNum + 1, 0, tmp[boardNum].cards[cardNum]);
        setBoards(tmp);  
    }

    function setBName(boardNum, name) {
        let tmp = boards.slice();
        tmp[boardNum].name = name;
        setBoards(tmp);  
    }

    function setCName(boardNum, cardNum, name) {
        let tmp = boards.slice();
        tmp[boardNum].cards[cardNum].name = name;
        setBoards(tmp);  
    }

    function setCDesc(boardNum, cardNum, desc) {
        let tmp = boards.slice();
        tmp[boardNum].cards[cardNum].description = desc;
        setBoards(tmp);  
    }

    function opCo(boardNum, cardNum, opened) {
        let tmp = boards.slice();
        tmp[boardNum].cards[cardNum].opened = opened;
        setBoards(tmp);  
    }

    // a függvények, amiket a Cardnak kell átadni
    const cardFn = {
        delCard: delCard,
        copyCard: copyCard,
        setName: setCName,
        setDesc: setCDesc,
        opCo: opCo
    }

    // a függvények, amiket a Boardnak kell átadni 
    // (belemásolva a Card függvények is, hogy át tudja adni a Cardoknak)
    const boardFn = {
        delBoard: delBoard,
        newCard: newCard,
        setBName: setBName,
        cardFn: cardFn
    }

    return (
        <div className="App">
        {
            boards.map((board, boardNum) => {
                return (
                    <Dashboard
                        key={ boardNum }
                        data={ board }
                        index={ boardNum }
                        fn={ boardFn }
                    />
                );
            })
        }
            <button title="New Dashboard" className="add-dashboard-btn" onClick={ newBoard }>+</button>
        </div>
    );
}


function Dashboard(props) {
    return (
        <div className="Dashboard">
            <div className="dash-title-bar">
                <input
                    type="text"
                    value={ props.data.name }
                    onChange={ e => props.fn.setBName(props.index, e.target.value) }
                    className="dash-title"
                />
                <div>
                    <button onClick={ () => props.fn.delBoard(props.index) }>Delete board</button>
                    <button onClick={ () => props.fn.newCard(props.index) }>Create card</button>
                </div>
            </div>
            <div className="dash-contents">
                {
                    props.data.cards.map((card, cardNum) =>
                        <Card 
                            key={ cardNum }
                            data={ card }
                            index={ cardNum } 
                            board={ props.index } 
                            fn={ props.fn.cardFn }
                        />
                    )
                }
            </div>
        </div>
    )
}


function Card(props) {
    return (
        <div 
            className={ 'Card' + (props.data.opened ? '' : ' closed') } 
            onClick={ () => props.fn.opCo(props.board, props.index, !props.data.opened) }
        >
            <input
				type="text"
				value={ props.data.name }
				onChange={ e => props.fn.setName(props.board, props.index, e.target.value) }
                className="card-title"
                onClick={ e => e.stopPropagation() }
			/>
			{/*<button onClick={ () => props.fn.copyCard(props.board, props.index) }>C</button>*/}
            <button title="Delete Card" onClick={ (e) => { 
                e.stopPropagation();
                props.fn.delCard(props.board, props.index);
            }}></button>
            
			<div className="card-desc">
                <textarea 
                    className="description"
                    placeholder="Write a description..."
					value={ props.data.description }
                    onChange={ e => props.fn.setDesc(props.board, props.index, e.target.value) }
                    onClick={ e => e.stopPropagation() }
				></textarea>
			</div>
        </div>
    )
}

export default App;
