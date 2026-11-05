import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SERVICE_SLUGS} from '../src/lib/inquiry.ts';
import {subscriptionTopics, subscriptionTopic, subscriptionHref} from '../src/lib/subscription-topics.ts';

test('subscription choices cover every registered service exactly once', () => {
  assert.deepEqual(subscriptionTopics.map(topic => topic.slug).sort(), [...SERVICE_SLUGS].sort());
  assert.equal(new Set(subscriptionTopics.map(topic => topic.slug)).size, subscriptionTopics.length);
  assert.equal(new Set(subscriptionTopics.map(topic => topic.listId)).size, subscriptionTopics.length);
  for (const topic of subscriptionTopics) assert.match(topic.listId, /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/);
});

test('a contextual subscription selects one exact subject without broadening consent', () => {
  assert.equal(subscriptionHref('web-design'), '/subscribe/?topic=web-design');
  assert.equal(subscriptionTopic('web-design')?.title, 'Web Design');
  for (const value of [undefined, null, '', 'Web Design', 'web-design,seo', 'all', 'https://example.com', '<script>']) {
    assert.equal(subscriptionTopic(value), undefined);
    assert.equal(subscriptionHref(value ?? undefined), '/subscribe/');
  }
});
