'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Award } from 'lucide-react';

type CoreTeamMember = { name: string; position: string; photo?: string };
type FacultyMentor = { name: string; role?: string; photo?: string };

interface TeamTabsSectionProps {
  coreTeam: CoreTeamMember[];
  facultyMentors: FacultyMentor[];
}

function TeamTabsSection({ coreTeam, facultyMentors }: TeamTabsSectionProps) {
  const [activeTab, setActiveTab] = useState<'team' | 'faculty' | 'volunteers' | 'community'>('team');

  const volunteerTeam = coreTeam.filter(
    (member) =>
      member.position.toLowerCase().includes('volunteer') ||
      member.position.toLowerCase().includes('volunteering'),
  );

  const communityTeam = coreTeam.filter((member) => member.position.toLowerCase().includes('community'));

  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Meet our people
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            From core team and faculty to volunteers and community champions, these are the people powering YTOP
            Global&apos;s impact.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            type="button"
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 text-sm font-semibold rounded-full border transition ${
              activeTab === 'team'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-primary hover:text-primary'
            }`}
          >
            Team Members
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('faculty')}
            className={`px-4 py-2 text-sm font-semibold rounded-full border transition ${
              activeTab === 'faculty'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-primary hover:text-primary'
            }`}
          >
            Faculty & Mentors
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('volunteers')}
            className={`px-4 py-2 text-sm font-semibold rounded-full border transition ${
              activeTab === 'volunteers'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-primary hover:text-primary'
            }`}
          >
            Volunteers
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('community')}
            className={`px-4 py-2 text-sm font-semibold rounded-full border transition ${
              activeTab === 'community'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-primary hover:text-primary'
            }`}
          >
            Community Members
          </button>
        </div>

        {/* Team Members tab */}
        {activeTab === 'team' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreTeam.map((member) => (
              <div
                key={member.name}
                className="group bg-white rounded-2xl shadow-ytop overflow-hidden border border-slate-100 hover:shadow-ytop-lg hover:border-ytop-blue/20 transition-all duration-300"
              >
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ytop-blue-light to-slate-100">
                      <span className="text-5xl font-bold text-ytop-blue/80 group-hover:text-ytop-blue transition-colors">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                      {member.position}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-ytop-blue transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-ytop-blue font-medium text-sm">
                    {member.position}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Faculty & mentors tab */}
        {activeTab === 'faculty' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-ytop-blue text-white">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Faculty & mentors
                </h3>
                <p className="text-sm text-slate-600">
                  Part of YTOP Global faculty and mentors who support our programs and the Rise of Warriors.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {facultyMentors.map((person) => (
                <div
                  key={person.name}
                  className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-ytop-blue/20 transition-all duration-300 text-center"
                >
                  {person.photo ? (
                    <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-ytop-blue/20">
                      <Image
                        src={person.photo}
                        alt={person.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-ytop-blue-light flex items-center justify-center">
                      <Users className="w-8 h-8 text-ytop-blue" />
                    </div>
                  )}
                  <p className="font-semibold text-slate-900 text-sm md:text-base leading-tight">
                    {person.name}
                  </p>
                  {person.role && (
                    <p className="text-xs text-ytop-blue font-medium mt-1">
                      {person.role}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Volunteers tab */}
        {activeTab === 'volunteers' && (
          <div className="space-y-8">
            <div className="max-w-3xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Volunteers
              </h3>
              <p className="text-slate-600">
                Volunteers are at the heart of YTOP Global – from coordinating programs to supporting Project 300 and
                Rise of Warriors. Here are some of the leaders helping to steward our volunteer community.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(volunteerTeam.length > 0 ? volunteerTeam : coreTeam).map((member) => (
                <div
                  key={member.name}
                  className="group bg-white rounded-2xl shadow-ytop overflow-hidden border border-slate-100 hover:shadow-ytop-lg hover:border-ytop-blue/20 transition-all duration-300"
                >
                  <div className="relative h-56 bg-slate-100 overflow-hidden">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ytop-blue-light to-slate-100">
                        <span className="text-5xl font-bold text-ytop-blue/80 group-hover:text-ytop-blue transition-colors">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-ytop-blue transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-ytop-blue font-medium text-sm">
                      {member.position}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href="/volunteer"
                className="inline-flex items-center px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition shadow-md"
              >
                Become a volunteer
              </Link>
            </div>
          </div>
        )}

        {/* Community members tab */}
        {activeTab === 'community' && (
          <div className="space-y-8">
            <div className="max-w-3xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Community members
              </h3>
              <p className="text-slate-600">
                Beyond our core team and volunteers, YTOP Global is sustained by a wider community of supporters,
                alumni, and partners who champion our work in their schools, campuses, workplaces, and cities.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(communityTeam.length > 0 ? communityTeam : coreTeam).map((member) => (
                <div
                  key={member.name}
                  className="group bg-white rounded-2xl shadow-ytop overflow-hidden border border-slate-100 hover:shadow-ytop-lg hover:border-ytop-blue/20 transition-all duration-300"
                >
                  <div className="relative h-56 bg-slate-100 overflow-hidden">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ytop-blue-light to-slate-100">
                        <span className="text-5xl font-bold text-ytop-blue/80 group-hover:text-ytop-blue transition-colors">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-ytop-blue transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-ytop-blue font-medium text-sm">
                      {member.position}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href="/get-involved"
                className="inline-flex items-center px-5 py-2.5 rounded-full border border-slate-300 text-sm font-semibold text-slate-800 hover:border-primary hover:text-primary transition"
              >
                See ways to plug into the community
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default TeamTabsSection;

