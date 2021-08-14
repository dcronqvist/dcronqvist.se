import React from 'react'
import useSWR from 'swr'
import { Theme, useTheme } from '../contexts/ThemeContext'
import styled from 'styled-components'
const fetcher = (url) => fetch(url).then((r) => r.json())

const Event = ({ event }) => {
  if (event.type === 'WatchEvent') {
    return (
      <td>
        starred{' '}
        <a target="_blank" href={`https://github.com/${event.repo.name}`}>
          {event.repo.name}
        </a>
      </td>
    )
  } else if (event.type === 'PushEvent') {
    return (
      <td>
        pushed{' '}
        <a
          target="_blank"
          href={`https://github.com/${event.repo.name}/commit/${event.payload.head}`}
        >
          {event.payload.size} {event.payload.size > 1 ? 'commits' : 'commit'}
        </a>{' '}
        to{' '}
        <a target="_blank" href={`https://github.com/${event.repo.name}`}>
          {event.repo.name.replace('dcronqvist/', '')}
        </a>
      </td>
    )
  } else if (event.type === 'PullRequestEvent') {
    return (
      <td>
        {event.payload.action === 'closed' ? 'closed' : 'opened'}{' '}
        <a target="_blank" href={`https://github.com/${event.repo.name}`}>
          {event.repo.name.replace('dcronqvist/', '')}
        </a>{' '}
        PR{' '}
        <a
          target="_blank"
          href={`https://github.com/${event.repo.name}/pull/${event.payload.number}`}
        >
          #{event.payload.number}
        </a>
      </td>
    )
  }

  return <></>
}

type DayOfEventsProps = {
  date: string
  events: any[] // eslint-disable-line
}

const EventRow = styled.tr<{ theme: Theme }>`
  margin-bottom: 5px;
  font-weight: 300;
  transition: all 0.2 ease;

  & a {
    text-decoration: underline;
    font-weight: 400;
    color: inherit;
  }
`

const EventDateColumn = styled.td`
  display: inline-block;
  margin: 0;
  padding: 0;
  padding-right: 4px;
  font-weight: 400;
  font-size: inherit;
  min-width: fit-content;
  transition: all 0.2 ease;
`

const DayOfEvents = ({ date, events }: DayOfEventsProps) => {
  const { theme } = useTheme()

  const formatDate = (date: Date) => {
    const today = new Date()

    const formatMonth = (month: number) => {
      return [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ][month]
    }

    if (today.getUTCDate() == date.getUTCDate()) {
      return 'Today'
    }

    return date.getDate() + ' ' + formatMonth(date.getMonth())
  }

  const filteredEvents = events.filter(
    (event) =>
      event.event.type != 'DeleteEvent' &&
      event.event.type != 'IssueCommentEvent'
  )

  const firstRow = filteredEvents.slice(0, 1).map((event) => {
    return (
      <EventRow theme={theme} key={`${date}${event.event.id}`}>
        <EventDateColumn>{formatDate(new Date(date))}</EventDateColumn>
        <Event event={event.event} />
      </EventRow>
    )
  })

  const rows = filteredEvents.slice(1, 2).map((event) => {
    return (
      <EventRow theme={theme} key={`${date}${event.event.id}`}>
        <EventDateColumn></EventDateColumn>
        <Event event={event.event} />
      </EventRow>
    )
  })

  return (
    <>
      {firstRow}
      {rows}
      {events.length > 2 ? (
        <EventRow theme={theme}>
          <td></td>
          <td>{`+ ${events.length - 2} more`}</td>
        </EventRow>
      ) : (
        ''
      )}
    </>
  )
}

const TableContainer = styled.table`
  font-size: 20px;
  transition: all 0.2 ease;

  @media (max-width: 800px) {
    font-size: 16px;
  }
`

export type GithubActivityProps = {
  username: string
}

const GithubActivity = ({ username }: GithubActivityProps): ReactNode => {
  const { data } = useSWR(
    `https://api.github.com/users/${username}/events`,
    fetcher
  )

  if (!data) return <div>{'loading...'}</div>

  // Accepts the array and key
  const groupBy = (array, key) => {
    // Return the end result

    return array
      .reduce((result, currentValue) => {
        // If an array already present for key, push it to the array. Else create an array and push the object
        const ind = result.findIndex((x) =>
          x.some((y) => y[key] === currentValue[key])
        )

        if (ind == -1) {
          result.push([currentValue])
          return result
        }

        result[ind].push(currentValue)
        // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
        return result
      }, [])
      .sort((a, b) => {
        return new Date(b[0].date).getTime() - new Date(a[0].date).getTime()
      }) // empty object is the initial value for result object
  }

  const grouped = groupBy(
    data.map((event) => {
      return {
        date: new Date(event.created_at).toDateString(),
        event: event
      }
    }),
    'date'
  )

  const mappedEvents = grouped
    .slice(0, 3)
    .map((events) => <DayOfEvents date={events[0].date} events={events} />)

  return <TableContainer>{mappedEvents}</TableContainer>
}

export default GithubActivity
