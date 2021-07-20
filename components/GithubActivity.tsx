import React from 'react'
import styles from '../styles/commitlist.module.css'
import useSWR, { SWRConfig } from 'swr'
const fetcher = url => fetch(url).then(r => r.json())

const Event = ({event}) => {

    if (event.type === "WatchEvent") {
        return <td>
            starred <a target="_blank" href={`https://github.com/${event.repo.name}`}>{event.repo.name}</a>
        </td>
    }
    else if (event.type === "PushEvent") {
        return <td>
            pushed <a target="_blank" href={`https://github.com/dcronqvist/restberry-api/commit/${event.payload.head}`}>{event.payload.size} {event.payload.size > 1 ? "commits" : "commit"}</a> to <a target="_blank" href={`https://github.com/${event.repo.name}`}>{event.repo.name.replace("dcronqvist/", "")}</a>
        </td>
    }
    else if (event.type === "PullRequestEvent") {
        return <td>
            {event.payload.action === "closed" ? "closed" : "opened"} <a target="_blank" href={`https://github.com/${event.repo.name}`}>{event.repo.name.replace("dcronqvist/", "")}</a> pull request <a target="_blank" href={`https://github.com/dcronqvist/restberry-api/pull/${event.payload.number}`}>#{event.payload.number}</a>
        </td>
    }

    return <>
    </>
}

type DayOfEventsProps = {
    date : string,
    events : any[]
}

const DayOfEvents = ({date, events} : DayOfEventsProps) => {
    const formatDate = (date : Date) => {

        const today = new Date()
    
        const formatMonth = (month : number) => {
            return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month]
        }
    
        if (today.getUTCDate() == date.getUTCDate()) {
            return "Today"
        }
    
        return date.getDate() + " " + formatMonth(date.getMonth())
    }

    const filteredEvents = events.filter(event => event.event.type != "DeleteEvent")

    const firstRow = filteredEvents.slice(0,1).map(event => {
        return <tr className={styles.event} key={`${date}${event.event.id}`}>
            <td className={styles.eventdate}>{formatDate(new Date(date))}</td>
            <Event event={event.event}/>
        </tr>
    })

    const rows = filteredEvents.slice(1,3).map(event => {
        return <tr className={styles.event} key={`${date}${event.event.id}`}>
            <td className={styles.eventdate}></td>
            <Event event={event.event}/>
        </tr>
    })

    return <>
        {firstRow}
        {rows}
        {events.length > 3 ? <tr className={styles.event}><td></td><td>{`+ ${events.length - 3} more`}</td></tr> : ''}
    </>
}

const GithubActivity = ({ username }) => {
    const { data } = useSWR(`https://api.github.com/users/${username}/events`, fetcher)
    
    if (!data) return <div>{"loading..."}</div>

    console.log(data)

    // Accepts the array and key
    const groupBy = (array, key) => {
        // Return the end result

        return array.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array and push the object
            const ind = result.findIndex(x => x.some(y => y[key] === currentValue[key]))
            
            if (ind == -1) {
                result.push([currentValue])
                return result
            }

            result[ind].push(currentValue)
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result
        }, []).sort((a,b) => {
            return new Date(b[0].date).getTime() -  new Date(a[0].date).getTime()
        }) // empty object is the initial value for result object
    }

    const grouped = groupBy(data.map(event => {
        return {
            date: new Date(event.created_at).toDateString(),
            event: event
        }
    }), 'date')

    const mappedEvents = grouped.slice(0, 3).map(events => <DayOfEvents date={events[0].date} events={events}/>)

    console.log(mappedEvents)

    return (
        <table className={styles.container}>
            {mappedEvents}
        </table>
    )
}

export default GithubActivity